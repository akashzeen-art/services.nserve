import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    id: 'fx',
    src: '/card-fx.png',
    label: '01 · Across Borders',
    title: 'Cross-border FX',
  },
  {
    id: 'corridors',
    src: '/card-corridors.png',
    label: '02 · Corridors',
    title: 'Global presence',
  },
]

function buildSeamlessLoop(items, spacing) {
  const overlap = Math.ceil(1 / spacing)
  const startTime = items.length * spacing + 0.5
  const loopTime = (items.length + overlap) * spacing + 1
  const rawSequence = gsap.timeline({ paused: true })
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) this._tTime += this._dur - 0.01
    },
  })

  const total = items.length + overlap * 2

  gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 })

  for (let i = 0; i < total; i += 1) {
    const index = i % items.length
    const item = items[index]
    const time = i * spacing

    rawSequence
      .fromTo(
        item,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.in',
          immediateRender: false,
        },
        time,
      )
      .fromTo(
        item,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: 'none', immediateRender: false },
        time,
      )

    if (i <= items.length) seamlessLoop.add(`label${i}`, time)
  }

  rawSequence.time(startTime)
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: 'none',
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: 'none',
      },
    )

  return seamlessLoop
}

export default function CardsGallery() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const cards = gsap.utils.toArray(root.querySelectorAll('.cards li'))
    const nextBtn = root.querySelector('.next')
    const prevBtn = root.querySelector('.prev')
    const imgs = root.querySelectorAll('.cards img')

    gsap.to(imgs, { opacity: 1, delay: 0.1, duration: 0.4 })

    let iteration = 0
    const spacing = 0.1
    const snap = gsap.utils.snap(spacing)
    const seamlessLoop = buildSeamlessLoop(cards, spacing)

    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true,
    })

    const wrapForward = (self) => {
      iteration += 1
      self.wrapping = true
      self.scroll(self.start + 1)
    }

    const wrapBackward = (self) => {
      iteration -= 1
      if (iteration < 0) {
        iteration = 9
        seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10)
        scrub.pause()
      }
      self.wrapping = true
      self.scroll(self.end - 1)
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=2400',
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self)
        } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
          wrapBackward(self)
        } else {
          scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration())
          scrub.invalidate().restart()
          self.wrapping = false
        }
      },
    })

    const scrubTo = (totalTime) => {
      const progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration()
      if (progress > 1) {
        wrapForward(trigger)
      } else if (progress < 0) {
        wrapBackward(trigger)
      } else {
        trigger.scroll(trigger.start + progress * (trigger.end - trigger.start))
      }
    }

    const onNext = () => scrubTo(scrub.vars.totalTime + spacing)
    const onPrev = () => scrubTo(scrub.vars.totalTime - spacing)

    nextBtn?.addEventListener('click', onNext)
    prevBtn?.addEventListener('click', onPrev)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      clearTimeout(refreshTimer)
      nextBtn?.removeEventListener('click', onNext)
      prevBtn?.removeEventListener('click', onPrev)
      scrub.kill()
      seamlessLoop.kill()
      trigger.kill()
    }
  }, [])

  return (
    <div className="gallery" ref={rootRef} aria-label="Cross-border cards">
      <p className="gallery-kicker">Cross-border payments</p>
      <ul className="cards">
        {CARDS.map((card) => (
          <li key={card.id}>
            <img src={card.src} alt={card.title} />
            <div className="card-meta">
              <span>{card.label}</span>
              <strong>{card.title}</strong>
            </div>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button type="button" className="prev">
          Prev
        </button>
        <button type="button" className="next">
          Next
        </button>
      </div>
    </div>
  )
}
