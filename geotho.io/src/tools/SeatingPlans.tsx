import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type MouseEvent,
} from "react";

interface Guest {
  id: string;
  name: string;
}

interface Seat {
  id: string;
  guestId: string | null;
}

type TableType = "round" | "top";

interface TablePosition {
  x: number;
  y: number;
}

interface Table {
  id: string;
  name: string;
  type: TableType;
  seats: Seat[];
  position: TablePosition;
}

interface TableDragState {
  tableId: string;
  offsetX: number;
  offsetY: number;
}

interface ActiveSeat {
  tableId: string;
  seatId: string;
}

interface PersistedSeatingPlanState {
  tables: Table[];
  tableCounter: number;
  newRoundTableSeats: number;
  topTableSeats: number;
  guests: Guest[];
  guestCounter: number;
  guestInput: string;
  tableLayerOrder: Record<string, number>;
  nextLayer: number;
}

const DRAG_GUEST_KEY = "application/x-seating-guest";
const SEATING_PLAN_STORAGE_KEY = "seating-plan-state-v1";
const ROUND_TABLE_SIZE = 320;
const TOP_TABLE_HEIGHT = 220;
const FLOOR_PLAN_HEIGHT = 920;
const FLOOR_PLAN_FALLBACK_WIDTH = 1100;
const DEFAULT_ROUND_TABLE_SEATS = 10;
const DEFAULT_TOP_TABLE_SEATS = 13;

const clampSeatCount = (count: number, fallback = DEFAULT_ROUND_TABLE_SEATS) => {
  if (Number.isNaN(count)) {
    return fallback;
  }

  return Math.max(2, Math.min(20, count));
};

const createSeats = (
  tableId: string,
  seatCount: number,
  existingSeats?: Seat[]
): Seat[] => {
  const safeSeatCount = clampSeatCount(seatCount);

  return Array.from({ length: safeSeatCount }, (_, index) => ({
    id: `${tableId}-seat-${index + 1}`,
    guestId: existingSeats?.[index]?.guestId ?? null,
  }));
};

const getTopTableWidth = (seatCount: number) => {
  const safeSeatCount = clampSeatCount(seatCount);
  return Math.max(360, Math.min(760, safeSeatCount * 74));
};

const getTableSize = (table: Table) => {
  if (table.type === "top") {
    return {
      width: getTopTableWidth(table.seats.length),
      height: TOP_TABLE_HEIGHT,
    };
  }

  return {
    width: ROUND_TABLE_SIZE,
    height: ROUND_TABLE_SIZE,
  };
};

const clampPosition = (
  x: number,
  y: number,
  table: Table,
  canvasWidth: number,
  canvasHeight: number
) => {
  const size = getTableSize(table);
  const maxX = Math.max(0, canvasWidth - size.width);
  const maxY = Math.max(0, canvasHeight - size.height);

  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  };
};

const createRoundTable = (
  tableNumber: number,
  seatCount: number,
  position: TablePosition
): Table => {
  const id = `table-${tableNumber}`;

  return {
    id,
    name: `Table ${tableNumber}`,
    type: "round",
    seats: createSeats(id, seatCount),
    position,
  };
};

const createTopTable = (seatCount: number, position: TablePosition): Table => {
  const id = "top-table";

  return {
    id,
    name: "Top Table",
    type: "top",
    seats: createSeats(id, seatCount),
    position,
  };
};

const parseGuestNames = (input: string) =>
  input
    .split(/\n|,/)
    .map((name) => name.trim())
    .filter(Boolean);

const createDefaultState = (): PersistedSeatingPlanState => ({
  tables: [createRoundTable(1, DEFAULT_ROUND_TABLE_SEATS, { x: 24, y: 24 })],
  tableCounter: 2,
  newRoundTableSeats: DEFAULT_ROUND_TABLE_SEATS,
  topTableSeats: DEFAULT_TOP_TABLE_SEATS,
  guests: [],
  guestCounter: 1,
  guestInput: "",
  tableLayerOrder: {},
  nextLayer: 2,
});

const sanitizeGuests = (guests: unknown): Guest[] => {
  if (!Array.isArray(guests)) {
    return [];
  }

  return guests.flatMap((guest, index) => {
    if (
      !guest ||
      typeof guest !== "object" ||
      typeof guest.id !== "string" ||
      typeof guest.name !== "string"
    ) {
      return [];
    }

    const trimmedName = guest.name.trim();

    if (!trimmedName) {
      return [];
    }

    return [
      {
        id: guest.id || `guest-${index + 1}`,
        name: trimmedName,
      },
    ];
  });
};

const sanitizeTables = (tables: unknown): Table[] => {
  if (!Array.isArray(tables)) {
    return [];
  }

  return tables.flatMap((table, index) => {
    if (!table || typeof table !== "object") {
      return [];
    }

    const type = table.type === "top" ? "top" : table.type === "round" ? "round" : null;

    if (!type || typeof table.id !== "string" || typeof table.name !== "string") {
      return [];
    }

    const position =
      table.position &&
      typeof table.position === "object" &&
      typeof table.position.x === "number" &&
      typeof table.position.y === "number"
        ? table.position
        : { x: 24, y: 24 + index * 32 };

    const seatSource = Array.isArray(table.seats) ? table.seats : [];
    const seatCountFallback =
      type === "top" ? DEFAULT_TOP_TABLE_SEATS : DEFAULT_ROUND_TABLE_SEATS;
    const seatCount = clampSeatCount(seatSource.length || seatCountFallback, seatCountFallback);

    return [
      {
        id: table.id,
        name: table.name.trim() || (type === "top" ? "Top Table" : `Table ${index + 1}`),
        type,
        seats: createSeats(table.id, seatCount, seatSource),
        position,
      },
    ];
  });
};

const getInitialState = (): PersistedSeatingPlanState => {
  const defaults = createDefaultState();

  if (typeof window === "undefined") {
    return defaults;
  }

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(SEATING_PLAN_STORAGE_KEY);
  } catch {
    return defaults;
  }

  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedSeatingPlanState>;
    const guests = sanitizeGuests(parsed.guests);
    const guestIds = new Set(guests.map((guest) => guest.id));
    const tables = sanitizeTables(parsed.tables).map((table) => ({
      ...table,
      seats: table.seats.map((seat) => ({
        ...seat,
        guestId: seat.guestId && guestIds.has(seat.guestId) ? seat.guestId : null,
      })),
    }));

    if (tables.length === 0) {
      return defaults;
    }

    return {
      tables,
      tableCounter:
        typeof parsed.tableCounter === "number"
          ? parsed.tableCounter
          : defaults.tableCounter,
      newRoundTableSeats:
        typeof parsed.newRoundTableSeats === "number"
          ? clampSeatCount(parsed.newRoundTableSeats, DEFAULT_ROUND_TABLE_SEATS)
          : defaults.newRoundTableSeats,
      topTableSeats:
        typeof parsed.topTableSeats === "number"
          ? clampSeatCount(parsed.topTableSeats, DEFAULT_TOP_TABLE_SEATS)
          : defaults.topTableSeats,
      guests,
      guestCounter:
        typeof parsed.guestCounter === "number"
          ? parsed.guestCounter
          : defaults.guestCounter,
      guestInput:
        typeof parsed.guestInput === "string" ? parsed.guestInput : defaults.guestInput,
      tableLayerOrder:
        parsed.tableLayerOrder && typeof parsed.tableLayerOrder === "object"
          ? parsed.tableLayerOrder
          : defaults.tableLayerOrder,
      nextLayer:
        typeof parsed.nextLayer === "number"
          ? parsed.nextLayer
          : defaults.nextLayer,
    };
  } catch {
    return defaults;
  }
};

const shuffleArray = <T,>(items: T[]) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
};

const getNextRoundTablePosition = (roundTableCount: number, hasTopTable: boolean) => {
  const col = roundTableCount % 3;
  const row = Math.floor(roundTableCount / 3);

  return {
    x: 24 + col * 336,
    y: (hasTopTable ? 286 : 24) + row * 336,
  };
};

const SeatingPlans = () => {
  const initialState = useMemo(() => getInitialState(), []);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const nextLayerRef = useRef(initialState.nextLayer);

  const [tables, setTables] = useState<Table[]>(initialState.tables);
  const [tableCounter, setTableCounter] = useState(initialState.tableCounter);
  const [newRoundTableSeats, setNewRoundTableSeats] = useState(
    initialState.newRoundTableSeats
  );
  const [topTableSeats, setTopTableSeats] = useState(initialState.topTableSeats);

  const [guests, setGuests] = useState<Guest[]>(initialState.guests);
  const [guestCounter, setGuestCounter] = useState(initialState.guestCounter);
  const [guestInput, setGuestInput] = useState(initialState.guestInput);

  const [draggedTable, setDraggedTable] = useState<TableDragState | null>(null);
  const [activeSeat, setActiveSeat] = useState<ActiveSeat | null>(null);
  const [tableLayerOrder, setTableLayerOrder] = useState<Record<string, number>>(
    initialState.tableLayerOrder
  );
  const [canvasWidth, setCanvasWidth] = useState(FLOOR_PLAN_FALLBACK_WIDTH);

  const assignedGuestIds = useMemo(() => {
    const ids = new Set<string>();

    tables.forEach((table) => {
      table.seats.forEach((seat) => {
        if (seat.guestId) {
          ids.add(seat.guestId);
        }
      });
    });

    return ids;
  }, [tables]);

  const unseatedGuests = useMemo(
    () => guests.filter((guest) => !assignedGuestIds.has(guest.id)),
    [guests, assignedGuestIds]
  );

  const guestsById = useMemo(
    () => new Map(guests.map((guest) => [guest.id, guest])),
    [guests]
  );

  const totalSeats = useMemo(
    () => tables.reduce((total, table) => total + table.seats.length, 0),
    [tables]
  );

  const hasTopTable = tables.some((table) => table.type === "top");
  const totalAssigned = assignedGuestIds.size;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedState: PersistedSeatingPlanState = {
      tables,
      tableCounter,
      newRoundTableSeats,
      topTableSeats,
      guests,
      guestCounter,
      guestInput,
      tableLayerOrder,
      nextLayer: nextLayerRef.current,
    };

    try {
      window.localStorage.setItem(
        SEATING_PLAN_STORAGE_KEY,
        JSON.stringify(persistedState)
      );
      // Ignore storage failures (private mode, quota exceeded) and keep app usable.
    } catch {
      return;
    }
  }, [
    guests,
    guestCounter,
    guestInput,
    newRoundTableSeats,
    tableCounter,
    tableLayerOrder,
    tables,
    topTableSeats,
  ]);

  useEffect(() => {
    if (!draggedTable) {
      return;
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const nextX = event.clientX - canvasRect.left - draggedTable.offsetX;
      const nextY = event.clientY - canvasRect.top - draggedTable.offsetY;

      setTables((current) => {
        const tableIndex = current.findIndex(
          (table) => table.id === draggedTable.tableId
        );

        if (tableIndex === -1) {
          return current;
        }

        const table = current[tableIndex];
        const clampedPosition = clampPosition(
          nextX,
          nextY,
          table,
          canvasRect.width,
          FLOOR_PLAN_HEIGHT
        );

        if (
          table.position.x === clampedPosition.x &&
          table.position.y === clampedPosition.y
        ) {
          return current;
        }

        const next = [...current];
        next[tableIndex] = { ...table, position: clampedPosition };
        return next;
      });
    };

    const handleMouseUp = () => {
      setDraggedTable(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedTable]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const updateCanvasWidth = () => {
      setCanvasWidth(canvas.clientWidth || FLOOR_PLAN_FALLBACK_WIDTH);
    };

    updateCanvasWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateCanvasWidth);

      return () => {
        window.removeEventListener("resize", updateCanvasWidth);
      };
    }

    const observer = new ResizeObserver(updateCanvasWidth);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setTables((current) =>
      current.map((table) => {
        const nextPosition =
          table.type === "top"
            ? {
                ...clampPosition(
                  Math.max(24, (canvasWidth - getTopTableWidth(table.seats.length)) / 2),
                  table.position.y,
                  table,
                  canvasWidth,
                  FLOOR_PLAN_HEIGHT
                ),
              }
            : clampPosition(
                table.position.x,
                table.position.y,
                table,
                canvasWidth,
                FLOOR_PLAN_HEIGHT
              );

        if (
          nextPosition.x === table.position.x &&
          nextPosition.y === table.position.y
        ) {
          return table;
        }

        return {
          ...table,
          position: nextPosition,
        };
      })
    );
  }, [canvasWidth]);

  const getDraggedGuestId = (event: DragEvent) => {
    const guestId = event.dataTransfer.getData(DRAG_GUEST_KEY);

    if (!guestId) {
      return null;
    }

    return guestId;
  };

  const onGuestDragStart = (event: DragEvent, guestId: string) => {
    event.dataTransfer.setData(DRAG_GUEST_KEY, guestId);
    event.dataTransfer.effectAllowed = "move";
  };

  const bringTableToFront = (tableId: string) => {
    setTableLayerOrder((current) => ({
      ...current,
      [tableId]: nextLayerRef.current,
    }));
    nextLayerRef.current += 1;
  };

  const isActiveSeat = (tableId: string, seatId: string) =>
    activeSeat?.tableId === tableId && activeSeat.seatId === seatId;

  const handleSeatClick = (tableId: string, seatId: string) => {
    bringTableToFront(tableId);
    setActiveSeat((current) => {
      if (current?.tableId === tableId && current.seatId === seatId) {
        return null;
      }

      return { tableId, seatId };
    });
  };

  const handleTableNameChange = (tableId: string, name: string) => {
    setTables((current) =>
      current.map((table) => (table.id === tableId ? { ...table, name } : table))
    );
  };

  const handleTableDragStart = (
    event: MouseEvent<HTMLButtonElement>,
    table: Table
  ) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    bringTableToFront(table.id);
    setActiveSeat(null);

    setDraggedTable({
      tableId: table.id,
      offsetX: event.clientX - canvasRect.left - table.position.x,
      offsetY: event.clientY - canvasRect.top - table.position.y,
    });
  };

  const handleRandomlyAllocateAll = () => {
    if (guests.length === 0) {
      return;
    }

    const topSeatCount = clampSeatCount(topTableSeats, DEFAULT_TOP_TABLE_SEATS);
    const roundSeatCount = clampSeatCount(
      newRoundTableSeats,
      DEFAULT_ROUND_TABLE_SEATS
    );
    const remainingGuestCount = Math.max(0, guests.length - topSeatCount);
    const requiredRoundTableCount = Math.ceil(remainingGuestCount / roundSeatCount);
    const topTableX = Math.max(
      24,
      (canvasWidth - getTopTableWidth(topSeatCount)) / 2
    );

    const rebuiltTables: Table[] = [
      createTopTable(topSeatCount, { x: topTableX, y: 24 }),
    ];

    for (
      let tableIndex = 0;
      tableIndex < requiredRoundTableCount;
      tableIndex += 1
    ) {
      rebuiltTables.push(
        createRoundTable(
          tableIndex + 1,
          roundSeatCount,
          getNextRoundTablePosition(tableIndex, true)
        )
      );
    }

    const shuffledGuestIds = shuffleArray(guests.map((guest) => guest.id));
    let guestIndex = 0;

    const allocatedTables = rebuiltTables.map((table) => ({
      ...table,
      seats: table.seats.map((seat) => {
        if (guestIndex >= shuffledGuestIds.length) {
          return { ...seat, guestId: null };
        }

        const guestId = shuffledGuestIds[guestIndex];
        guestIndex += 1;

        return { ...seat, guestId };
      }),
    }));

    setTables(allocatedTables);
    setTableCounter(requiredRoundTableCount + 1);
    setDraggedTable(null);
    setActiveSeat(null);
    setTableLayerOrder({});
    nextLayerRef.current = 2;
  };

  const handleClearAssignments = () => {
    setActiveSeat(null);
    setTables((current) =>
      current.map((table) => ({
        ...table,
        seats: table.seats.map((seat) => ({ ...seat, guestId: null })),
      }))
    );
  };

  const handleResetPlanner = () => {
    const defaults = createDefaultState();

    setTables(defaults.tables);
    setTableCounter(defaults.tableCounter);
    setNewRoundTableSeats(defaults.newRoundTableSeats);
    setTopTableSeats(defaults.topTableSeats);
    setGuests(defaults.guests);
    setGuestCounter(defaults.guestCounter);
    setGuestInput(defaults.guestInput);
    setDraggedTable(null);
    setActiveSeat(null);
    setTableLayerOrder(defaults.tableLayerOrder);
    nextLayerRef.current = defaults.nextLayer;
  };

  const handleAddRoundTable = (event: FormEvent) => {
    event.preventDefault();

    const seatCount = clampSeatCount(newRoundTableSeats);
    setTables((current) => {
      const roundTableCount = current.filter((table) => table.type === "round").length;
      const topTableAlreadyExists = current.some((table) => table.type === "top");
      const position = getNextRoundTablePosition(
        roundTableCount,
        topTableAlreadyExists
      );
      return [...current, createRoundTable(tableCounter, seatCount, position)];
    });
    setTableCounter((value) => value + 1);
    setNewRoundTableSeats(seatCount);
  };

  const handleUpsertTopTable = (event: FormEvent) => {
    event.preventDefault();

    const seatCount = clampSeatCount(topTableSeats, DEFAULT_TOP_TABLE_SEATS);
    setTables((current) => {
      const topTableIndex = current.findIndex((table) => table.type === "top");

      if (topTableIndex === -1) {
        const x = Math.max(24, (canvasWidth - getTopTableWidth(seatCount)) / 2);
        return [createTopTable(seatCount, { x, y: 24 }), ...current];
      }

      const currentTopTable = current[topTableIndex];
      const resizedTopTable: Table = {
        ...currentTopTable,
        seats: createSeats(currentTopTable.id, seatCount, currentTopTable.seats),
      };

      const clamped = clampPosition(
        resizedTopTable.position.x,
        resizedTopTable.position.y,
        resizedTopTable,
        canvasWidth,
        FLOOR_PLAN_HEIGHT
      );

      const next = [...current];
      next[topTableIndex] = {
        ...resizedTopTable,
        position: clamped,
      };

      return next;
    });

    setTopTableSeats(seatCount);
  };

  const handleAddGuests = (event: FormEvent) => {
    event.preventDefault();

    const names = parseGuestNames(guestInput);
    if (names.length === 0) {
      return;
    }

    let nextGuestCounter = guestCounter;

    const createdGuests = names.map((name) => {
      const guest = {
        id: `guest-${nextGuestCounter}`,
        name,
      };

      nextGuestCounter += 1;
      return guest;
    });

    setGuests((current) => [...current, ...createdGuests]);
    setGuestCounter(nextGuestCounter);
    setGuestInput("");
  };

  const removeGuest = (guestId: string) => {
    setGuests((current) => current.filter((guest) => guest.id !== guestId));
    setActiveSeat(null);

    setTables((current) =>
      current.map((table) => ({
        ...table,
        seats: table.seats.map((seat) =>
          seat.guestId === guestId ? { ...seat, guestId: null } : seat
        ),
      }))
    );
  };

  const removeTable = (tableId: string) => {
    setDraggedTable((current) => (current?.tableId === tableId ? null : current));
    setActiveSeat((current) => (current?.tableId === tableId ? null : current));
    setTableLayerOrder((current) => {
      if (!(tableId in current)) {
        return current;
      }

      const next = { ...current };
      delete next[tableId];
      return next;
    });
    setTables((current) => current.filter((table) => table.id !== tableId));
  };

  const unseatGuest = (guestId: string) => {
    setActiveSeat(null);
    setTables((current) =>
      current.map((table) => ({
        ...table,
        seats: table.seats.map((seat) =>
          seat.guestId === guestId ? { ...seat, guestId: null } : seat
        ),
      }))
    );
  };

  const moveGuestToSeat = (
    guestId: string,
    destinationTableId: string,
    destinationSeatId: string
  ) => {
    setTables((current) => {
      const next = current.map((table) => ({
        ...table,
        seats: table.seats.map((seat) => ({ ...seat })),
      }));

      let source: { tableIndex: number; seatIndex: number } | null = null;
      let destination: { tableIndex: number; seatIndex: number } | null = null;

      for (let tableIndex = 0; tableIndex < next.length; tableIndex += 1) {
        const table = next[tableIndex];

        for (let seatIndex = 0; seatIndex < table.seats.length; seatIndex += 1) {
          const seat = table.seats[seatIndex];

          if (seat.guestId === guestId) {
            source = { tableIndex, seatIndex };
          }

          if (table.id === destinationTableId && seat.id === destinationSeatId) {
            destination = { tableIndex, seatIndex };
          }
        }
      }

      if (!destination) {
        return current;
      }

      const destinationPosition = destination;

      if (
        source &&
        source.tableIndex === destinationPosition.tableIndex &&
        source.seatIndex === destinationPosition.seatIndex
      ) {
        return current;
      }

      const destinationSeat =
        next[destinationPosition.tableIndex].seats[destinationPosition.seatIndex];
      const displacedGuestId = destinationSeat.guestId;

      if (source) {
        next[source.tableIndex].seats[source.seatIndex].guestId = null;
      }

      destinationSeat.guestId = guestId;

      if (source && displacedGuestId && displacedGuestId !== guestId) {
        next[source.tableIndex].seats[source.seatIndex].guestId = displacedGuestId;
      }

      return next;
    });
  };

  const handleDropOnSeat = (
    event: DragEvent,
    tableId: string,
    seatId: string
  ) => {
    event.preventDefault();

    const guestId = getDraggedGuestId(event);
    if (!guestId) {
      return;
    }

    moveGuestToSeat(guestId, tableId, seatId);
    setActiveSeat({ tableId, seatId });
    bringTableToFront(tableId);
  };

  const handleDropToUnseated = (event: DragEvent) => {
    event.preventDefault();

    const guestId = getDraggedGuestId(event);
    if (!guestId) {
      return;
    }

    unseatGuest(guestId);
  };

  const remainingSeats = totalSeats - totalAssigned;
  const hasCapacityWarning = guests.length > totalSeats;

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-black/10 rounded-lg p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Wedding Seating Plan Generator
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white/70 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Guests</h3>
            <p className="mt-1 text-sm text-gray-600">
              Add one guest per line or separate multiple guests with commas.
            </p>

            <form onSubmit={handleAddGuests} className="mt-4 space-y-3">
              <textarea
                value={guestInput}
                onChange={(event) => setGuestInput(event.target.value)}
                placeholder="Alex\nSam\nPriya"
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Add Guests
              </button>
            </form>
          </section>

          <section
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDropToUnseated}
            className="rounded-lg border border-dashed border-gray-300 bg-white/70 p-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Unseated Guests</h3>
            <p className="mt-1 text-sm text-gray-600">
              Drag guests onto seats. Drag seated guests back here to unassign.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 min-h-12">
              {unseatedGuests.length === 0 ? (
                <p className="text-sm text-gray-500">No unseated guests.</p>
              ) : (
                unseatedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    draggable
                    onDragStart={(event) => onGuestDragStart(event, guest.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 cursor-grab active:cursor-grabbing"
                  >
                    <span>{guest.name}</span>
                    <button
                      type="button"
                      onClick={() => removeGuest(guest.id)}
                      className="rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                      aria-label={`Remove ${guest.name}`}
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white/70 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Round Tables</h3>
            <form onSubmit={handleAddRoundTable} className="mt-4 flex items-end gap-3">
              <label className="flex-1 text-sm text-gray-700">
                Seats per table
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={newRoundTableSeats}
                  onChange={(event) =>
                    setNewRoundTableSeats(
                      clampSeatCount(Number.parseInt(event.target.value, 10))
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Add Round Table
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white/70 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Table</h3>
            <form onSubmit={handleUpsertTopTable} className="mt-4 flex items-end gap-3">
              <label className="flex-1 text-sm text-gray-700">
                Guests at top table
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={topTableSeats}
                  onChange={(event) =>
                    setTopTableSeats(
                      clampSeatCount(
                        Number.parseInt(event.target.value, 10),
                        DEFAULT_TOP_TABLE_SEATS
                      )
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                {hasTopTable ? "Update Top Table" : "Add Top Table"}
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white/70 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Auto Allocation</h3>
            <p className="mt-1 text-sm text-gray-600">
              Creates one top table and enough round tables to seat everyone.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRandomlyAllocateAll}
                disabled={guests.length === 0}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Randomly Allocate All Guests
              </button>
              <button
                type="button"
                onClick={handleClearAssignments}
                disabled={totalAssigned === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Assignments
              </button>
              <button
                type="button"
                onClick={handleResetPlanner}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Reset Planner
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white/70 p-4 text-sm text-gray-700">
            <p>
              Guests: <span className="font-semibold text-gray-900">{guests.length}</span>
            </p>
            <p>
              Assigned: <span className="font-semibold text-gray-900">{totalAssigned}</span>
            </p>
            <p>
              Seats: <span className="font-semibold text-gray-900">{totalSeats}</span>
            </p>
            <p>
              Unseated:{" "}
              <span className="font-semibold text-gray-900">{unseatedGuests.length}</span>
            </p>
            <p>
              Remaining seats:{" "}
              <span className="font-semibold text-gray-900">{remainingSeats}</span>
            </p>
            <p>
              Tables: <span className="font-semibold text-gray-900">{tables.length}</span>
            </p>
            {hasCapacityWarning ? (
              <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                You have more guests than seats. Add tables or run auto allocation.
              </p>
            ) : null}
          </section>
        </div>

        <div className="xl:col-span-2">
          <section className="rounded-lg border border-gray-200 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Floor Plan</h3>
              <p className="text-xs text-gray-600">
                Use the Drag handle on each table to reposition it.
              </p>
            </div>

            <div
              ref={canvasRef}
              onClick={() => setActiveSeat(null)}
              className="relative w-full overflow-auto rounded-lg border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ height: FLOOR_PLAN_HEIGHT }}
            >
              {tables.map((table) => {
                const tableSize = getTableSize(table);

                return (
                  <div
                    key={table.id}
                    className="absolute"
                    style={{
                      left: table.position.x,
                      top: table.position.y,
                      width: tableSize.width,
                      height: tableSize.height + 44,
                      zIndex: tableLayerOrder[table.id] ?? 1,
                    }}
                    onMouseDown={() => bringTableToFront(table.id)}
                    >
                    <div className="mb-2 flex items-center justify-between rounded-md border border-gray-300 bg-white/90 px-3 py-1.5">
                      <div className="min-w-0 flex-1 pr-2">
                        <input
                          type="text"
                          value={table.name}
                          onChange={(event) =>
                            handleTableNameChange(table.id, event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                          onMouseDown={(event) => event.stopPropagation()}
                          className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-gray-900 outline-none focus:border-gray-300 focus:bg-white"
                        />
                        <p className="text-[11px] text-gray-600">
                          {table.seats.length} seats
                        </p>
                      </div>
                      <button
                        type="button"
                        onMouseDown={(event) => handleTableDragStart(event, table)}
                        className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Drag
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTable(table.id)}
                        className="ml-2 rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>

                    {table.type === "round" ? (
                      <div className="relative h-80 w-80">
                        <div className="absolute inset-16 rounded-full border border-gray-300 bg-gray-50/80 shadow-inner" />

                        {table.seats.map((seat, index) => {
                          const angle =
                            (index / table.seats.length) * Math.PI * 2 - Math.PI / 2;
                          const left = 160 + Math.cos(angle) * 124;
                          const top = 160 + Math.sin(angle) * 124;
                          const guest = seat.guestId ? guestsById.get(seat.guestId) : null;
                          const seatIsActive = isActiveSeat(table.id, seat.id);

                          return (
                            <div
                              key={seat.id}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) =>
                                handleDropOnSeat(event, table.id, seat.id)
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSeatClick(table.id, seat.id);
                              }}
                              className={`absolute -translate-x-1/2 -translate-y-1/2 w-24 rounded-lg border bg-white p-1.5 text-center shadow-sm ${
                                seatIsActive
                                  ? "z-40 border-gray-700 ring-2 ring-gray-700/20 shadow-lg"
                                  : "z-10 border-gray-300"
                              }`}
                              style={{ left, top }}
                            >
                              {guest ? (
                                <div
                                  draggable
                                  onDragStart={(event) =>
                                    onGuestDragStart(event, guest.id)
                                  }
                                  className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 cursor-grab active:cursor-grabbing truncate"
                                  title={guest.name}
                                >
                                  {guest.name}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">Drop guest</p>
                              )}
                              {seatIsActive && guest ? (
                                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 w-56 -translate-x-1/2 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-lg">
                                  {guest.name}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        className="relative"
                        style={{
                          width: getTopTableWidth(table.seats.length),
                          height: TOP_TABLE_HEIGHT,
                        }}
                      >
                        <div className="absolute left-1/2 top-1/2 h-16 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-300 bg-white/90 shadow-inner" />

                        {table.seats.map((seat, index) => {
                          const width = getTopTableWidth(table.seats.length);
                          const sidePadding = 48;
                          const rowCount = table.seats.length;

                          const left =
                            rowCount <= 1
                              ? width / 2
                              :
                                sidePadding +
                                (index * (width - sidePadding * 2)) /
                                  (rowCount - 1);
                          const top = 34;
                          const guest = seat.guestId ? guestsById.get(seat.guestId) : null;
                          const seatIsActive = isActiveSeat(table.id, seat.id);

                          return (
                            <div
                              key={seat.id}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) =>
                                handleDropOnSeat(event, table.id, seat.id)
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSeatClick(table.id, seat.id);
                              }}
                              className={`absolute -translate-x-1/2 -translate-y-1/2 w-24 rounded-lg border bg-white p-1.5 text-center shadow-sm ${
                                seatIsActive
                                  ? "z-40 border-gray-700 ring-2 ring-gray-700/20 shadow-lg"
                                  : "z-10 border-gray-300"
                              }`}
                              style={{ left, top }}
                            >
                              {guest ? (
                                <div
                                  draggable
                                  onDragStart={(event) =>
                                    onGuestDragStart(event, guest.id)
                                  }
                                  className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 cursor-grab active:cursor-grabbing truncate"
                                  title={guest.name}
                                >
                                  {guest.name}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">Drop guest</p>
                              )}
                              {seatIsActive && guest ? (
                                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 w-56 -translate-x-1/2 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-lg">
                                  {guest.name}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SeatingPlans;
