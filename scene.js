export default function build({ THREE, scene, root, cam, RM }) {
  scene.add(new THREE.HemisphereLight(0xfff6dd, 0x0f3d4a, .9));
  const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(4, 3, 7); scene.add(key);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5, metalness: .1 }, o));
  const fan = new THREE.Group(); fan.position.y = 1.1; root.add(fan);
  // ceiling plate + rod + motor
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .16, 40), std(0x0f3d4a)); plate.position.y = 3.2; fan.add(plate);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.6, 16), std(0x0f3d4a)); rod.position.y = 2.4; fan.add(rod);
  const spin = new THREE.Group(); spin.position.y = 1.5; fan.add(spin);
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, .45, 40), std(0x13566a, { metalness: .3, roughness: .35 })); spin.add(motor);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.55, 32, 16, 0, 6.283, 0, 1.2), std(0xffc933, { metalness: .3 })); cap.position.y = .22; spin.add(cap);
  const woods = [0xd8a56a, 0xc08a52];
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * 6.283, arm = new THREE.Group(); arm.rotation.y = a;
    const bl = new THREE.Mesh(new THREE.BoxGeometry(2.3, .06, .62), std(woods[i % 2], { roughness: .8, metalness: 0 })); bl.position.set(1.85, -.1, 0); bl.rotation.z = .1; bl.rotation.x = .12; arm.add(bl);
    const ir = new THREE.Mesh(new THREE.BoxGeometry(.6, .05, .16), std(0x0f3d4a)); ir.position.set(.9, -.07, 0); arm.add(ir);
    spin.add(arm);
  }
  const blur = new THREE.Mesh(new THREE.CircleGeometry(3.05, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xd8a56a, transparent: true, opacity: 0, depthWrite: false })); blur.position.y = -.1; spin.add(blur);
  // light kit
  const kit = new THREE.Mesh(new THREE.CylinderGeometry(.2, .3, .25, 24), std(0x0f3d4a)); kit.position.y = -.35; spin.add(kit);
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd34e, emissiveIntensity: 1.6, transparent: true, opacity: .95 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.38, 32, 24), bulbMat); bulb.position.y = -.68; spin.add(bulb);
  const glow = new THREE.PointLight(0xffd34e, 18, 9); glow.position.y = -.7; spin.add(glow);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(.85, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffe28a, transparent: true, opacity: .22, depthWrite: false })); halo.position.y = -.68; spin.add(halo);
  // pull chain
  const chain = new THREE.Group(); chain.position.set(.2, -.9, 0); spin.add(chain);
  const link = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .8), std(0xcccccc, { metalness: .8 })); link.position.y = -.4; chain.add(link);
  const pull = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 12), std(0xffc933)); pull.position.y = -.82; chain.add(pull);
  let on = true, ang = 0, speed = 0, lit = 1;
  return {
    toggleLight() { on = !on; return on; },
    update({ t, dt, p, px, py, rot, RM }) {
      const target = RM ? 0 : .3 + p * 14;
      speed += (target - speed) * Math.min(1, dt * 2.5);
      if (RM) ang = p * 6.283; else ang += speed * dt;
      spin.rotation.y = ang;
      blur.material.opacity = Math.min(.45, Math.max(0, (speed - 6) * .06));
      fan.rotation.y = rot * .4; fan.rotation.x = .28 + py * .12; fan.rotation.z = -px * .08;
      cam.position.x = px * .6; cam.lookAt(0, 1.7, 0);
      lit += ((on ? 1 : 0) - lit) * Math.min(1, dt * 8 + (RM ? 1 : 0));
      bulbMat.emissiveIntensity = .05 + 1.6 * lit; glow.intensity = 18 * lit; halo.material.opacity = .22 * lit;
      chain.rotation.z = Math.sin(t * 2) * .04 + px * .05;
    }
  };
}
