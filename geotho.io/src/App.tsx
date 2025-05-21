function App() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <main className="max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">George Thomas</h1>
        <h2 className="text-xl text-zinc-600 mb-8">Cofounder of Clusterfudge.com</h2>
        
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/geotho" className="text-zinc-600 hover:text-zinc-900" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/geotho" className="text-zinc-600 hover:text-zinc-900" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </main>
      
      <footer className="mt-12 text-sm text-zinc-500">
        © {new Date().getFullYear()} George Thomas
      </footer>
    </div>
  );
}

export default App;