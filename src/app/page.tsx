'use client'
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { faTemperature0 } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { ref, db, onValue } from "@/utils/config";

export interface NodeInterface {
  [key: string]: NodeSelectedInterface;
}

export interface NodeSelectedInterface {
  dateTime: string;
  hum: number;
  light: number;
  temp: number;
  location: {
    lat: number;
    lng: number;
  };
}

export default function Home() {

  const [nodeName, setNodeName] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NodeSelectedInterface>();
  const [nodes, setNodes] = useState<NodeInterface[]>([]);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nodesRef = ref(db, 'nodes');
        // Suscripción a cambios en tiempo real
        const unsubscribe = onValue(nodesRef, (snapshot) => {
          const data = snapshot.val();
          setStatus(true);
          setNodes(data);
          if (nodeName?.length > 0) {
            const selectedNode: NodeSelectedInterface = data[nodeName as any] as any;
            if (selectedNode) {
              setSelectedNode(() => selectedNode);
            }
          }
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [nodeName]);
 

  const handleNodeSelect = (selected: any) => {
    const selectedNode: NodeSelectedInterface = nodes[selected] as any;
    if (selectedNode) {
      setNodeName(selected);
      setSelectedNode(selectedNode);
    }
  };

  return (
    <div className="flex bg-gray-900 text-white">
      <Sidebar nodeData={nodes} onNodeSelect={handleNodeSelect} />
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">IoT Dashboard</h1>
          </div>
          {/* show datetime of last sense data */}
          { selectedNode && <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Last update: </h1>
            <h1 className="text-2xl font-bold">{selectedNode?.dateTime}</h1>
          </div>}
          { selectedNode && <div className="flex items-center space-x-4">
            { status ? <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p>Online</p>
            </div>
            : <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p>Offline</p>
            </div>}
            </div>}
        </div>

        <div className="mt-10 p-10 w-full">
          {selectedNode ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-11 justify-center items-start'>
              <Card
                title="Temperature"
                description="Current Temperature readings"
                color="#3b82f6"
                icon={faTemperature0}
                measure={"°C"}
                value={selectedNode.temp} 
                />
              <Card 
                title="Humidity"
                description="Current Humidity readings"
                color="#22c55e"
                icon={faDroplet}
                measure={"%"}
                value={selectedNode.hum} 
                />
              <Card 
                title="Light Level"
                description="Current Light Level readings"
                color="#eab308"
                icon={faLightbulb}
                measure={"lux"}
                value={selectedNode.light} />
              <Card 
                title="Location"
                description="Current location of IoT sensor"
                color="#ef4444"
                icon={faLocation}
                measure={""}
                value={`${selectedNode.location.lat}, ${selectedNode.location.lng}`} />
            </div>
          ): (
            <div className="text-center w-full mt-10 w-100">
              <h1 className="text-4xl font-bold text-gray-800">Select a node to see its data</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
