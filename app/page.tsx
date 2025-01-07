'use client'

import React, { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      setMessage('Usuário criado com sucesso!')
      e.currentTarget.reset()
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800">
          <h1 className="text-2xl font-bold mb-8 text-center text-white">
            Adicionar Novo Usuário
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md 
                         text-white placeholder-zinc-400 focus:outline-none focus:ring-2 
                         focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md 
                         text-white placeholder-zinc-400 focus:outline-none focus:ring-2 
                         focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Digite o email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-black font-medium rounded-md
                       hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-white disabled:bg-zinc-600 disabled:cursor-not-allowed
                       transition duration-200 mt-8"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                'Adicionar Usuário'
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-md ${
              message.includes('Erro') 
                ? 'bg-red-900/50 border border-red-800 text-red-200' 
                : 'bg-green-900/50 border border-green-800 text-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 