export default function ApplicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mis Aplicaciones</h1>
      <p className="text-muted-foreground">
        Aquí podrás ver todas tus aplicaciones y su estado actual.
      </p>
      
      <div className="mt-8 p-8 text-center border rounded-lg border-dashed">
        <h2 className="text-xl font-semibold mb-2">No hay aplicaciones activas</h2>
        <p className="text-muted-foreground">
          Cuando envíes una aplicación, aparecerá aquí para que puedas hacer seguimiento.
        </p>
      </div>
    </div>
  )
}
