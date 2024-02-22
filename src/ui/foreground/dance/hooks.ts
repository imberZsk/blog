// @ts-nocheck

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useTheme } from 'next-themes'

export const useLoadModal = () => {
  const containerRef = useRef<HTMLDivElement>(null) // 添加一个 ref
  const [loading, setLoading] = useState(true)

  const { theme } = useTheme()

  useEffect(() => {
    let camera: THREE.PerspectiveCamera | null = null
    let scene: THREE.Scene | null = null
    let renderer: THREE.WebGLRenderer | null = null
    const loader = new FBXLoader()

    const clock = new THREE.Clock()
    let mixer: THREE.AnimationMixer | null = null

    // 初始化
    const init = (): void => {
      // #region 1、相机
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
      camera.position.set(100, 200, 300)
      // #endregion

      // #region 2、场景
      scene = new THREE.Scene()
      // scene.background = new THREE.Color(theme === 'dark' ? 0x000000 : 0xa0a0a0) // 设置背景颜色为黑色
      // scene.fog = new THREE.Fog(theme === 'dark' ? 0x000000 : 0xa0a0a0, 200, 1000) // 设置雾效颜色为黑色
      updateSceneColors() // 更新场景的背景颜色和雾效颜色
      // #endregion

      // #region 3、灯光
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5)
      hemiLight.position.set(0, 200, 0)
      scene.add(hemiLight)

      const dirLight = new THREE.DirectionalLight(0xffffff, 5)
      dirLight.position.set(0, 200, 100)
      dirLight.castShadow = true
      dirLight.shadow.camera.top = 180
      dirLight.shadow.camera.bottom = -100
      dirLight.shadow.camera.left = -120
      dirLight.shadow.camera.right = 120
      scene.add(dirLight)
      // #endregion

      // #region 4、材质
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true
      scene.add(mesh)
      const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
      grid.material.opacity = 0.2
      grid.material.transparent = true
      scene.add(grid)
      // #endregion

      // #region 5、渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true }) // 创建渲染器
      // renderer.shadowMap.enabled = true // 启用阴影渲染
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement) // 将渲染器的 DOM 元素添加到容器中
      }
      // #endregion

      // #region 6、控制器
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 100, 0)
      controls.update()
      window.addEventListener('resize', onWindowResize)
      // #endregion

      // #region 7、加载模型
      loader.load(
        '/model/dance.fbx',
        object => {
          // 模型加入场景
          scene?.add(object)

          // 动画
          mixer = new THREE.AnimationMixer(object)
          const action = mixer.clipAction(object.animations[0])
          action.play()

          object.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })

          // 启动动画循环
          animate()
        },
        progress => {
          if (progress.loaded >= progress.total) {
            console.log('加载完成')
          }
        },
        error => {
          console.error(error)
        }
      )
      // #endregion
    }

    const updateSceneColors = (): void => {
      const backgroundColor = theme === 'dark' ? 0x000000 : 0xa0a0a0
      const fogColor = theme === 'dark' ? 0x000000 : 0xa0a0a0

      scene.background = new THREE.Color(backgroundColor)
      scene.fog = new THREE.Fog(fogColor, 200, 1000)
    }

    function onWindowResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    //循环动画
    function animate(): void {
      requestAnimationFrame(animate)

      //获取自上一帧绘制以来经过的时间（以秒为单位），即时间差。
      const delta = clock.getDelta()

      //如果存在动画混合器（mixer已经在模型加载时被赋值），则调用update()方法更新动画状态。delta被传递给update()方法，以控制动画播放速度和流畅度。
      if (mixer) {
        mixer.update(delta)
      }

      if (renderer && scene && camera) {
        // console.log('screen')
        setLoading(false)
        renderer.render(scene, camera)
      }
    }

    init()
  }, [theme])

  return {
    containerRef,
    loading
  }
}
