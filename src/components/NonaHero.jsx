import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger, CustomEase)

const LEFT_LABELS = ['UPI', 'Cards', 'Wallets', 'Netbanking', 'Recurring']
const RIGHT_LABELS = ['Onboard', 'Integrate', 'Test', 'Settle', 'Go Live']

export default function NonaHero() {
  const rootRef = useRef(null)
  const dateRef = useRef(null)
  const lenisRef = useRef(null)

  const goToPaths = (e) => {
    e.preventDefault()
    const target = document.querySelector('#two-paths') || document.querySelector('#after-hero')
    if (!target) return
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -24, duration: 1.45 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const hero = rootRef.current
    if (!hero || hero.dataset.ready === 'true') return
    hero.dataset.ready = 'true'

    CustomEase.create('nonaHeroEase', '0.6, 0.01, 0.05, 1')
    CustomEase.create('nonaHeroSoft', '0.16, 1, 0.3, 1')
    CustomEase.create('nonaHeroSnap', '0.77, 0, 0.175, 1')

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const videoFrame = hero.querySelector('.nona-hero-video-frame')
    const mediaStart = hero.querySelector('.nona-hero-video-start')
    const mediaEnd = hero.querySelector('.nona-hero-video-end')
    const mediaLayers = hero.querySelectorAll('.nona-hero-video')
    const darkOverlay = hero.querySelector('.nona-hero-dark-overlay')
    const overlay = hero.querySelector('.nona-hero-overlay')
    const overlayInner = hero.querySelector('.nona-hero-overlay-inner')
    const introCopy = hero.querySelector('.nona-hero-center-copy')
    const introOverline = hero.querySelector('.nona-hero-overline')
    const introText = hero.querySelector('.nona-hero-intro-text')
    const prelude = hero.querySelector('.nona-hero-prelude')
    const sideLeft = hero.querySelector('.nona-hero-sidecopy-left')
    const sideRight = hero.querySelector('.nona-hero-sidecopy-right')
    const sideLeftItems = hero.querySelectorAll('.nona-hero-sidecopy-left span')
    const sideRightItems = hero.querySelectorAll('.nona-hero-sidecopy-right span')
    const frameLabels = hero.querySelectorAll('.nona-hero-frame-label')
    const progressBar = hero.querySelector('.nona-hero-progress-bar')
    const bottomNote = hero.querySelector('.nona-hero-bottom-note')
    const dateElement = dateRef.current
    const introTitle = hero.querySelector('.nona-hero-intro-title[data-split]')
    const overlayTitle = hero.querySelector('.nona-hero-overlay-title[data-split]')

    if (!videoFrame || !mediaStart || !mediaEnd || !darkOverlay || !overlay || !overlayInner) {
      return () => {
        gsap.ticker.remove(tickerFn)
        lenis.destroy()
      }
    }

    const updateDateTime = () => {
      if (!dateElement) return
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      dateElement.textContent = `INDIA READY · ${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`
    }

    updateDateTime()
    const dateTimer = setInterval(updateDateTime, 1000)

    const splitIntro = introTitle
      ? new SplitType(introTitle, { types: 'chars, words' })
      : null
    const splitOverlay = overlayTitle
      ? new SplitType(overlayTitle, { types: 'chars, words' })
      : null

    const introChars = splitIntro
      ? hero.querySelectorAll('.nona-hero-intro-title .char')
      : []
    const overlayChars = splitOverlay
      ? hero.querySelectorAll('.nona-hero-overlay-title .char')
      : []

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const startSize = isMobile ? '210px' : '300px'

    gsap.set(videoFrame, {
      width: startSize,
      height: startSize,
      x: 0,
      y: 0,
      rotate: 0.001,
      transformOrigin: '50% 50%',
    })
    gsap.set(mediaLayers, { scale: 1 })
    gsap.set(mediaStart, { opacity: 1, zIndex: 0 })
    gsap.set(mediaEnd, { opacity: 0, zIndex: 1 })
    gsap.set(overlay, { opacity: 0, clipPath: 'inset(100% 0 0 0)' })
    gsap.set(overlayInner, { filter: 'blur(14px)', scale: 1.06 })
    gsap.set(progressBar, { width: '0%' })

    if (introChars.length) {
      gsap.set(introChars, {
        yPercent: 120,
        opacity: 0,
        rotateX: -40,
        filter: 'blur(8px)',
      })
      gsap.to(introChars, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        stagger: 0.018,
        duration: 1,
        ease: 'nonaHeroSoft',
      })
    }

    gsap.set(overlayChars, {
      yPercent: 120,
      opacity: 0,
      rotateX: -22,
      filter: 'blur(8px)',
    })

    gsap.set([introOverline, introText], {
      y: 18,
      opacity: 0,
      filter: 'blur(8px)',
    })

    gsap.to([introOverline, introText], {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.9,
      stagger: 0.08,
      ease: 'nonaHeroSoft',
    })

    const breathe = gsap.to(videoFrame, {
      scale: 1.035,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    const midSize = isMobile ? '280px' : '380px'
    const snapSize = isMobile ? '300px' : '420px'

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.45,
        markers: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBar) {
            gsap.set(progressBar, { width: `${self.progress * 100}%` })
          }
        },
      },
    })

    tl.to(
      sideLeftItems,
      {
        xPercent: -260,
        opacity: 0.9,
        stagger: 0.06,
        ease: 'none',
        duration: 0.28,
      },
      0,
    )
      .to(
        sideRightItems,
        {
          xPercent: 260,
          opacity: 0.9,
          stagger: 0.06,
          ease: 'none',
          duration: 0.28,
        },
        0,
      )
      .to(prelude, { y: -18, opacity: 0.55, ease: 'none', duration: 0.2 }, 0)
      .to(bottomNote, { y: 18, opacity: 0.6, ease: 'none', duration: 0.2 }, 0)
      .to(
        introCopy,
        {
          y: -36,
          scale: 0.96,
          filter: 'blur(2px)',
          ease: 'none',
          duration: 0.22,
        },
        0.02,
      )
      .to(
        introChars,
        {
          x: (i) => (i % 2 === 0 ? -18 : 18),
          y: (i) => (i % 3 === 0 ? -28 : 18),
          rotate: (i) => (i % 2 === 0 ? -4 : 4),
          opacity: 0.82,
          filter: 'blur(1px)',
          stagger: { each: 0.004, from: 'center' },
          ease: 'none',
          duration: 0.24,
        },
        0.04,
      )
      .to(
        videoFrame,
        {
          width: midSize,
          height: midSize,
          rotate: 1080,
          x: isMobile ? 0 : 56,
          y: isMobile ? 0 : -42,
          ease: 'none',
          duration: 0.26,
        },
        0.05,
      )
      .to(mediaLayers, { scale: 1.16, ease: 'none', duration: 0.26 }, 0.05)
      .to(
        frameLabels,
        {
          y: (i) => (i === 0 ? 14 : -14),
          opacity: 0.75,
          ease: 'none',
          duration: 0.2,
        },
        0.06,
      )
      .to(
        introChars,
        {
          x: (i) => (i - introChars.length / 2) * 7,
          y: (i) => (i % 2 === 0 ? -120 : 120),
          rotate: (i) => (i % 2 === 0 ? -18 : 18),
          opacity: 0,
          filter: 'blur(10px)',
          stagger: { each: 0.003, from: 'edges' },
          ease: 'power2.inOut',
          duration: 0.22,
        },
        0.22,
      )
      .to(
        introOverline,
        {
          x: -80,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power2.inOut',
          duration: 0.18,
        },
        0.24,
      )
      .to(
        introText,
        {
          x: 80,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power2.inOut',
          duration: 0.18,
        },
        0.24,
      )
      .to(
        sideLeft,
        {
          x: -120,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power2.inOut',
          duration: 0.18,
        },
        0.3,
      )
      .to(
        sideRight,
        {
          x: 120,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power2.inOut',
          duration: 0.18,
        },
        0.3,
      )
      .to(
        prelude,
        {
          opacity: 0,
          y: -38,
          filter: 'blur(6px)',
          ease: 'power2.inOut',
          duration: 0.16,
        },
        0.32,
      )
      .to(
        videoFrame,
        {
          rotate: 1440,
          x: 0,
          y: 0,
          width: snapSize,
          height: snapSize,
          ease: 'power3.inOut',
          duration: 0.16,
        },
        0.34,
      )
      .to(
        videoFrame,
        {
          width: '100vw',
          height: '100svh',
          rotate: 1440,
          x: 0,
          y: 0,
          borderColor: 'rgba(15,23,42,0)',
          boxShadow: '0 0 0 rgba(15,23,42,0)',
          ease: 'expo.out',
          duration: 0.5,
        },
        0.42,
      )
      /* Swap to Namaste India (nserve.png) as soon as the frame goes full */
      .to(mediaStart, { opacity: 0, ease: 'power2.inOut', duration: 0.2 }, 0.42)
      .to(mediaEnd, { opacity: 1, ease: 'power2.inOut', duration: 0.2 }, 0.42)
      .to(mediaLayers, { scale: 1.05, ease: 'expo.out', duration: 0.5 }, 0.42)
      .to(frameLabels, { opacity: 0, ease: 'power2.out', duration: 0.12 }, 0.46)
      .to(
        darkOverlay,
        {
          backgroundColor: 'rgba(15,23,42,0.18)',
          ease: 'power3.inOut',
          duration: 0.38,
        },
        0.5,
      )
      .to(
        overlay,
        {
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          ease: 'expo.out',
          duration: 0.32,
        },
        0.7,
      )
      .to(
        overlayInner,
        {
          filter: 'blur(0px)',
          scale: 1,
          opacity: 0.95,
          ease: 'expo.out',
          duration: 0.34,
        },
        0.72,
      )
      .to(
        overlayChars,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          stagger: { each: 0.012, from: 'center' },
          ease: 'expo.out',
          duration: 0.38,
        },
        0.74,
      )
      .to(bottomNote, { opacity: 0, y: 26, ease: 'power2.out', duration: 0.12 }, 0.82)

    const sideLeftTween = gsap.to(sideLeftItems, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '45% top',
        scrub: true,
      },
      xPercent: -120,
      stagger: 0.04,
      ease: 'none',
    })

    const sideRightTween = gsap.to(sideRightItems, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '45% top',
        scrub: true,
      },
      xPercent: 120,
      stagger: 0.04,
      ease: 'none',
    })

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      clearTimeout(refreshTimer)
      clearInterval(dateTimer)
      breathe.kill()
      tl.kill()
      sideLeftTween.kill()
      sideRightTween.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      splitIntro?.revert()
      splitOverlay?.revert()
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      lenisRef.current = null
      hero.dataset.ready = 'false'
    }
  }, [])

  return (
    <div className="nona-hero-scroll" data-nona-hero ref={rootRef}>
      <div className="nona-hero-sticky">
        <div className="nona-hero-prelude">
          <div className="nona-hero-kicker nona-hero-logo">
            <img src="/nservelogo.png" alt="nSERVE" />
          </div>
          <div className="nona-hero-kicker">Scroll to enter</div>
        </div>

        <div className="nona-hero-sidecopy nona-hero-sidecopy-left" aria-hidden="true">
          {LEFT_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="nona-hero-sidecopy nona-hero-sidecopy-right" aria-hidden="true">
          {RIGHT_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="nona-hero-center-copy">
          <p className="nona-hero-overline">Payment Gateway · India</p>
          <h1 className="nona-hero-intro-title" data-split>
            INDIA
          </h1>
          <p className="nona-hero-intro-text">
            Merchant onboarding, local payments, simple integration — and a clear path to go live
            with one India-focused partner.
          </p>
        </div>

        <div className="nona-hero-video-frame">
          <img
            className="nona-hero-video nona-hero-video-start"
            src="/hero-india.jpg"
            alt=""
            aria-hidden="true"
          />
          <img
            className="nona-hero-video nona-hero-video-end"
            src="/nserve.png"
            alt="Namaste India — nSERVE payment gateway"
          />

          <div className="nona-hero-dark-overlay" />

          <div className="nona-hero-frame-label nona-hero-frame-label-top">
            <span>nSERVE.GATEWAY</span>
            <span>INDIA</span>
          </div>
          <div className="nona-hero-frame-label nona-hero-frame-label-bottom">
            <span>YOUR BUSINESS</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="nona-hero-overlay">
            <div className="nona-hero-date" ref={dateRef} />

            <div className="nona-hero-overlay-inner">
              <p className="nona-hero-overlay-kicker">Choose your next market</p>

              <a href="#two-paths" className="nona-hero-enter-link" onClick={goToPaths}>
                <h2 className="nona-hero-overlay-title" data-split>
                  Enter India
                </h2>
              </a>

              <p className="nona-hero-overlay-text">
                Tap to pick your path — cross-border corridors or India payment gateway.
              </p>
            </div>
          </div>
        </div>

        <div className="nona-hero-progress" aria-hidden="true">
          <div className="nona-hero-progress-bar" />
        </div>

        <a href="#two-paths" className="nona-hero-bottom-note" onClick={goToPaths}>
          <span>Enter India</span>
          <span>↓</span>
        </a>
      </div>
    </div>
  )
}
