export default function TeamPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mi Equipo</h1>
      <p className="text-muted-foreground">
        Gestiona a los miembros de tu equipo y sus roles en los proyectos.
      </p>
      
      <div className="mt-8 p-8 text-center border rounded-lg border-dashed">
        <h2 className="text-xl font-semibold mb-2">Tu equipo está vacío</h2>
        <p className="text-muted-foreground">
          Añade miembros a tu equipo para colaborar en proyectos.
        </p>
      </div>
    </div>
  )
}
