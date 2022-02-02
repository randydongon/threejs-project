import React, { Component } from "react";
import crate from "./textures/crate.gif";
import shapes from "./textures/shapes.png";
import { Canvas } from "react-three-fiber";
import { OrbitControls, TransformControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";

let scene, camera, cube, renderer;
class App extends Component {
  componentDidMount() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(2, 2, 2);
    // var geometry = new THREE.DodecahedronGeometry(1, 0);
    const texture = new THREE.TextureLoader().load(crate);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    // var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    const onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize, false);
  }

  render() {
    return (
      <>
        <Canvas style={{ width: "100%", height: "50vh", background: "#000" }}>
          {/* <TransformControls mode="translate" /> */}
          <OrbitControls makeDefault />
          <Stars />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 15, 10]} angle={0.3} />
          <Physics>
            <Box />
            <Plane />
          </Physics>
        </Canvas>
        <div ref={(ref) => (this.mount = ref)} />
      </>
    );
  }
}

/* <div ref={(ref) => (this.mount = ref)} /> */

function Box() {
  const [ref, api] = useBox(() => ({ mass: 1 }));
  return (
    <mesh onClick={() => api.velocity.set(0, 2, 0)} ref={ref} position={[0, 2, 0]}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" time={1} />
    </mesh>
  );
}

function Plane() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach={crate} args={[100, 100]} />
      <meshLambertMaterial attach="material" color="lightblue" />
    </mesh>
  );
}
// const App = () => {
//   return (
//     <Canvas className="canvas">
//
//       <Box />
//     </Canvas>
//   );
// };
export default App;
