import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { faTemperature0 } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLocation } from "@fortawesome/free-solid-svg-icons";

export default function Home() {

  // const [selectedNode, setSelectedNode] = useState(null);
  // const [nodesData, setNodesData] = useState([]);
  const nodesData: any = []
  const selectedNode: any = {
    id: 1,
    name: 'Node 1',
    x: 0,
  }

  // useEffect(() => {
  //   fetch('/api/nodes')
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // }, []);

  const handleNodeSelect = (node: any) => {
    console.log(node);
    // setSelectedNode(node);
  };

  return (
    <div className="flex bg-gray-900 text-white">
      <Sidebar nodeData={[]} onNodeSelect={handleNodeSelect} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-start mt-10 p-10">
        {selectedNode && (
          <>
            <Card
              title="Temperature"
              description="Current Temperature readings"
              color="#3b82f6"
              icon={faTemperature0}
              measure={"°C"}
              value={1000} 
              />
            <Card 
              title="Humidity"
              description="Current Humidity readings"
              color="#22c55e"
              icon={faDroplet}
              measure={"%"}
              value={1000} 
              />
            <Card 
              title="Light Level"
              description="Current Light Level readings"
              color="#eab308"
              icon={faLightbulb}
              measure={"lux"}
              value={1000} />
            <Card 
              title="Location"
              description="Current location of IoT sensor"
              color="#ef4444"
              icon={faLocation}
              measure={""}
              value={1000} />
          </>

        )}
      </div>
    </div>
  )
}
