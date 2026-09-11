import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const FX_URL = 'https://payments.nserve.co/'
const PSP_URL = 'https://gateway.nserve.co/'

const ease = [0.22, 1, 0.36, 1]

const productCards = [
  {
    id: 'fx',
    num: '01',
    kicker: 'Cross-border payments',
    title: 'Across Borders',
    body: 'Connect countries, currencies and stakeholders into one clear payment journey.',
    points: ['Live corridor rates', 'Compliance-ready flows', 'Settlement coordination'],
    cta: 'Know more',
    href: FX_URL,
    image: '/card-fx-v2.png',
    fallback: '/card-fx.png',
    accent: '#EA580C',
  },
  {
    id: 'psp',
    num: '02',
    kicker: 'Payment gateway · India',
    title: 'Namaste India',
    body: 'Launch locally with merchant onboarding, UPI-ready payments and a clear path to go live.',
    points: ['UPI, cards & wallets', 'Simple integration', 'One India partner'],
    cta: 'Know more',
    href: PSP_URL,
    image: '/card-map.png',
    fallback: '/nserve.png',
    accent: '#0EA5E9',
  },
]

export default function AfterHero() {
  return (
    <section className="nona-after-hero" id="after-hero">
      <div className="nona-fx">
        <motion.header
          className="nona-pick-intro"
          id="two-paths"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="nona-fx-kicker">One brand · Two paths</p>
          <h2 className="nona-pick-title">
            Where will you
            <em> grow next?</em>
          </h2>
          <p className="nona-pick-lede">
            Pick the experience that matches your next move — cross-border corridors, or India market
            launch.
          </p>
        </motion.header>

        <div className="nona-product-cards">
          {productCards.map((card, i) => (
            <motion.a
              key={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nona-product-card"
              style={{ '--card-accent': card.accent }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.08 + i * 0.1, ease }}
              whileHover={{ y: -8 }}
            >
              <div className="nona-product-card-media">
                <img
                  src={card.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = card.fallback
                  }}
                />
                <div className="nona-product-card-shade" />
                <span className="nona-product-card-num">{card.num}</span>
                <span className="nona-product-card-bar" aria-hidden="true" />
              </div>

              <div className="nona-product-card-body">
                <p className="nona-product-card-kicker">{card.kicker}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="nona-product-cta">
                  {card.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.footer
          className="nona-pick-footer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          <p className="nona-pick-footer-tagline">
            Connecting People. Payments. Processes.
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
