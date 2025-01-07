export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Adicionar Usuário | Admin</title>
      </head>
      <body>{children}</body>
    </html>
  )
} 