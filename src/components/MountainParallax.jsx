import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ASSETS = {
  cloud1Mask: 'https://assets.codepen.io/721952/cloud1Mask.jpg',
  sky: 'https://assets.codepen.io/721952/sky.jpg',
  mountBg: 'https://assets.codepen.io/721952/mountBg.png',
  mountMg: 'https://assets.codepen.io/721952/mountMg.png',
  cloud2: 'https://assets.codepen.io/721952/cloud2.png',
  mountFg: 'https://assets.codepen.io/721952/mountFg.png',
  cloud1: 'https://assets.codepen.io/721952/cloud1.png',
  cloud3: 'https://assets.codepen.io/721952/cloud3.png',
};

const SERVICES = [
  {
    id: 'gateway',
    kicker: '01 · Payment Gateway',
    title: 'India Gateway',
    copy: 'Accept payments the way India prefers — UPI, cards, wallets and hosted checkout.',
    tags: ['UPI', 'Cards', 'Checkout'],
    href: 'https://gateway.nserve.co/',
    cta: 'View More',
    image: '/cards/tajmahal.png',
    from: { x: -640, y: 520, rotate: -14 },
  },
  {
    id: 'crossborder',
    kicker: '02 · Cross Border',
    title: 'FOREX repatriation Enabler',
    copy: 'Move value worldwide with corridor coverage, currency liquidity and compliance-ready flows.',
    tags: ['FX', 'Corridors', 'Liquidity'],
    href: 'http://payments.nserve.co/',
    cta: 'View More',
    image: '/cards/crossborder.png',
    from: { x: 640, y: 520, rotate: 14 },
  },
];

export default function MountainParallax() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 720px)').matches;
      const gatewayFrom = isMobile
        ? { x: -220, y: 420, rotate: -10 }
        : { x: -640, y: 520, rotate: -14 };
      const crossFrom = isMobile
        ? { x: 220, y: 420, rotate: 10 }
        : { x: 640, y: 520, rotate: 14 };

      gsap.set('.services', { xPercent: -50, yPercent: -50 });
      gsap.set('.service-card--gateway', { ...gatewayFrom, opacity: 0, scale: 0.88 });
      gsap.set('.service-card--crossborder', { ...crossFrom, opacity: 0, scale: 0.88 });
      gsap.from('.brand-bar', { y: -24, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 });
      gsap.from('.scroll-hint', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.45 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.scrollDist',
            start: '0 0',
            end: '100% 100%',
            scrub: 1,
          },
        })
        .fromTo('.sky', { y: 0 }, { y: -200 }, 0)
        .fromTo('.cloud1', { y: 100 }, { y: -800 }, 0)
        .fromTo('.cloud2', { y: -150 }, { y: -500 }, 0)
        .fromTo('.cloud3', { y: -50 }, { y: -650 }, 0)
        .fromTo('.mountBg', { y: -10 }, { y: -100 }, 0)
        .fromTo('.mountMg', { y: -30 }, { y: -250 }, 0)
        .fromTo('.mountFg', { y: -50 }, { y: -600 }, 0)
        .fromTo('.scroll-hint', { opacity: 1 }, { opacity: 0 }, 0)
        .fromTo(
          '.service-card--gateway',
          { ...gatewayFrom, opacity: 0, scale: 0.88 },
          { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, ease: 'power3.out' },
          0.38,
        )
        .fromTo(
          '.service-card--crossborder',
          { ...crossFrom, opacity: 0, scale: 0.88 },
          { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, ease: 'power3.out' },
          0.44,
        );
    }, root);

    const arrowBtn = root.querySelector('#arrow-btn');
    const onEnter = () => {
      gsap.to('.arrow', { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' });
    };
    const onLeave = () => {
      gsap.to('.arrow', { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    };
    const onClick = () => {
      gsap.to(window, { scrollTo: innerHeight, duration: 1.5, ease: 'power1.inOut' });
    };

    arrowBtn?.addEventListener('mouseenter', onEnter);
    arrowBtn?.addEventListener('mouseleave', onLeave);
    arrowBtn?.addEventListener('click', onClick);

    return () => {
      arrowBtn?.removeEventListener('mouseenter', onEnter);
      arrowBtn?.removeEventListener('mouseleave', onLeave);
      arrowBtn?.removeEventListener('click', onClick);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="northface">
      <div className="scrollDist" />
      <main>
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <mask id="m">
            <g className="cloud1">
              <rect fill="#fff" width="100%" height="801" y="799" />
              <image href={ASSETS.cloud1Mask} width="1200" height="800" />
            </g>
          </mask>

          <image className="sky" href={ASSETS.sky} width="1200" height="590" />
          <image className="mountBg" href={ASSETS.mountBg} width="1200" height="800" />
          <image className="mountMg" href={ASSETS.mountMg} width="1200" height="800" />
          <image className="cloud2" href={ASSETS.cloud2} width="1200" height="800" />
          <image className="mountFg" href={ASSETS.mountFg} width="1200" height="800" />
          <image className="cloud1" href={ASSETS.cloud1} width="1200" height="800" />
          <image className="cloud3" href={ASSETS.cloud3} width="1200" height="800" />
          <text className="hero-word" fill="#fff" x="600" y="168" textAnchor="middle">
            DIGITAL
          </text>
          <polyline
            className="arrow"
            fill="#fff"
            points="599,218 599,257 590,247 590,250 600,260 610,250 610,247 601,257 601,218"
          />

          <g mask="url(#m)">
            <rect fill="#fff" width="100%" height="100%" />
            <text className="hero-word" x="600" y="168" fill="#162a43" textAnchor="middle">
              DIRECT
            </text>
          </g>

          <rect id="arrow-btn" width="100" height="100" opacity="0" x="550" y="190" style={{ cursor: 'pointer' }} />
        </svg>

        <div className="scene-vignette" aria-hidden="true" />

        <header className="brand-bar">
          <img src="/nservelogo.png" alt="" />
          <div>
            <strong>nSERVE</strong>
            <span>Where Digital Meets Direct</span>
          </div>
        </header>

        <p className="scroll-hint">
          Scroll to choose a path
          <i />
        </p>

        <div className="services" aria-label="nSERVE services">
          {SERVICES.map((service) => (
            <a
              key={service.id}
              className={`service-card service-card--${service.id}`}
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="service-media">
                <img src={service.image} alt="" />
              </div>
              <div className="service-body">
                <span className="service-kicker">{service.kicker}</span>
                <strong>{service.title}</strong>
                <p>{service.copy}</p>
                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="service-cta">
                  {service.cta}
                  <em>→</em>
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
