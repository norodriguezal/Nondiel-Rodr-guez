import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ContentNode } from '../types';

interface SceneProps {
  nodes: ContentNode[];
  activeNode: ContentNode | null;
  onNodeClick: (node: ContentNode) => void;
}

// Helper to calculate 3D position from spherical coordinates (percentages)
const getNodePosition = (node: ContentNode): [number, number, number] => {
  const radius = 20;
  // x: 0-100 -> 0-360 degrees (Azimuth)
  const theta = (node.x / 100) * Math.PI * 2;
  // y: 0-100 -> Vertical position (Phi)
  // 0 -> top (0), 50 -> middle (PI/2), 100 -> bottom (PI)
  const phi = (node.y / 100) * Math.PI; 
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  // Apply depth offset if any
  if (node.z) {
       const scale = 1 + (node.z / 100);
       return [x * scale, y * scale, z * scale];
  }

  return [x, y, z];
};

const NODE_SIZE = 3;

const NodeMesh: React.FC<{
  node: ContentNode;
  isActive: boolean;
  onClick: (node: ContentNode) => void;
}> = ({ node, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const position = useMemo(() => getNodePosition(node), [node]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
    if (glowRef.current && isActive) {
      // Pulse effect when active
      const scale = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        {/* Connection Lines (Simulated for this demo) */}
        {node.connections && node.connections.map((targetId) => {
            // NOTE: In a real app, we'd lookup position of targetId. 
            // For simplicity in this structure, skipping dynamic line drawing to avoid complexity in this file.
            return null;
        })}

        {/* Outer Glow (Visible when active or hovered) */}
        <mesh ref={glowRef} scale={isActive ? 1.2 : 1.0}>
          <sphereGeometry args={[NODE_SIZE * 0.6, 32, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={isActive ? 0.3 : 0.1}
            wireframe={true}
          />
        </mesh>

        {/* Main Planet/Node */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[NODE_SIZE * 0.5, 32, 32]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={isActive ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Floating Label */}
        <Text
          position={[0, NODE_SIZE * 0.8, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhFKS09A.woff"
        >
          {node.title.split(":")[0]}
        </Text>
      </group>
    </Float>
  );
};

const ConnectionLines: React.FC<{ nodes: ContentNode[] }> = ({ nodes }) => {
  const points = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    nodes.forEach(node => {
        if (node.connections) {
            node.connections.forEach(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (target) {
                    const p1 = new THREE.Vector3(...getNodePosition(node));
                    const p2 = new THREE.Vector3(...getNodePosition(target));
                    lines.push([p1, p2]);
                }
            });
        }
    });
    return lines;
  }, [nodes]);

  return (
    <group>
        {points.map((line, i) => (
            <Line
                key={i}
                points={line}
                color="rgba(0, 243, 255, 0.2)"
                lineWidth={1}
                transparent
                opacity={0.2}
            />
        ))}
    </group>
  );
};


const Scene: React.FC<SceneProps> = ({ nodes, activeNode, onNodeClick }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Central "Sun" or Core glow representing the topic anchor if desired, or just empty space */}
      
      <ConnectionLines nodes={nodes} />

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          isActive={activeNode?.id === node.id}
          onClick={onNodeClick}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={40}
        rotateSpeed={0.5}
        autoRotate={!activeNode}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default Scene;