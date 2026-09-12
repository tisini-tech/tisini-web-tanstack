import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/streams/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen p-36 flex flex-col space-y-8 font-bold text-4xl">
      <Link
        to="/streams/$fixType/fixtures"
        params={{ fixType: 'football' }}
        className="bg-blue-600 rounded-lg hover:bg-green-600 p-4 inline-block text-center"
      >
        Live Football
      </Link>

      <Link
        to="/streams/$fixType/fixtures"
        params={{ fixType: 'rugby' }}
        className="bg-blue-600 rounded-lg hover:bg-green-600 p-4 inline-block text-center"
      >
        Live Rugby
      </Link>

      {/* <button className="bg-blue-600 rounded-lg hover:bg-green-600 p-4">
    <Link to={"/streams/elgon"}>Elgon Cup</Link>
  </button>

  <button className="bg-blue-600 rounded-lg hover:bg-green-600 p-4">
    <Link to={"/streams/legends"}>Legends Cup</Link>
  </button> */}

      {/* <button className="bg-blue-600 rounded-lg hover:bg-green-600 p-4">
    <Link to={"/streams/rugby/evansbet"}>Evans bet</Link>
  </button>

  <button className="bg-blue-600 rounded-lg hover:bg-green-600 p-4">
    <Link to={"/streams/rugby/kawowo"}>Kawowo</Link>
  </button>

  <button className="bg-blue-600 rounded-lg hover:bg-green-600 p-4">
    <Link to={"/streams/football/tawi-tv"}>Tawi TV</Link>
  </button> */}
    </div>
  )
}
