import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
  originMarkets,
  INDIA_ID,
  indiaLaunchRoutes,
  countryNames,
} from '../data/indiaLaunchRoutes';

const ORIGIN_IDS = originMarkets.map((m) => m.id);
const LABEL_IDS = new Set(['IN', 'AE', 'US', 'GB', 'SG', 'DE', 'JP', 'AU']);

const ease = [0.22, 1, 0.36, 1];

const STATUS_LINES = [
  'Connecting Payment Gateway & Cross Border rails',
  'Enabling UPI, cards, wallets & local checkout',
  'Moving value across currencies and corridors',
  'Aligning settlement, liquidity & compliance',
  'Ready to choose your nSERVE path',
];

const PRELOADER_MS = 5000;

/**
 * Full-screen map preloader — Mercator map with cinematic zoom into India (5s).
 */
export default function MapPreloader({ onDone, durationMs = PRELOADER_MS }) {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!hostRef.current) return undefined;

    const root = am5.Root.new(hostRef.current);
    if (root._logo) root._logo.dispose();

    const nserveTheme = am5.Theme.new(root);
    nserveTheme.rule('InterfaceColors').setAll({
      primaryButton: am5.color(0xea580c),
      primaryButtonHover: am5.color(0xc2410c),
      primaryButtonDown: am5.color(0x9a3412),
      primaryButtonActive: am5.color(0xf97316),
      primaryButtonText: am5.color(0xffffff),
      secondaryButton: am5.color(0xe2e8f0),
      secondaryButtonHover: am5.color(0xcbd5e1),
      secondaryButtonDown: am5.color(0x94a3b8),
      secondaryButtonText: am5.color(0x0f172a),
      background: am5.color(0xf5f7fb),
      text: am5.color(0x0f172a),
    });

    root.setThemes([am5themes_Animated.new(root), nserveTheme]);

    root.container.set(
      'background',
      am5.Rectangle.new(root, {
        fill: am5.color(0xf5f7fb),
        fillGradient: am5.LinearGradient.new(root, {
          stops: [
            { color: am5.color(0xf8fafc) },
            { color: am5.color(0xeef2f7) },
            { color: am5.color(0xe8eef5) },
          ],
          rotation: 145,
        }),
      }),
    );

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'none',
        panY: 'none',
        wheelable: false,
        projection: am5map.geoMercator(),
        homeGeoPoint: { longitude: 40, latitude: 18 },
        homeZoomLevel: 1.05,
        maxZoomLevel: 4,
        minZoomLevel: 0.8,
        paddingTop: 36,
        paddingBottom: 110,
        paddingLeft: 12,
        paddingRight: 12,
      }),
    );

    const bgSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    bgSeries.mapPolygons.template.setAll({
      fill: am5.color(0xdce6f0),
      fillOpacity: 0,
      strokeOpacity: 0,
    });
    bgSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x94a3b8),
      strokeOpacity: 0.14,
      strokeWidth: 0.45,
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      }),
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xcbd5e1),
      stroke: am5.color(0x94a3b8),
      strokeWidth: 0.35,
      strokeOpacity: 0.4,
      fillOpacity: 0.92,
    });

    polygonSeries.events.on('datavalidated', () => {
      am5.array.each(polygonSeries.dataItems, (di) => {
        const id = di.get('id');
        const poly = di.get('mapPolygon');
        if (!poly || !id) return;

        if (id === INDIA_ID) {
          poly.setAll({
            fill: am5.color(0xea580c),
            stroke: am5.color(0xfbbf24),
            strokeWidth: 1.6,
            strokeOpacity: 1,
            fillOpacity: 1,
          });
        } else if (ORIGIN_IDS.includes(id)) {
          poly.setAll({
            fill: am5.color(0xf59e0b),
            stroke: am5.color(0xfbbf24),
            strokeWidth: 0.85,
            strokeOpacity: 0.95,
            fillOpacity: 0.95,
          });
        }
      });
    });

    // Soft country labels (no marker circle on India — shape fill is enough)
    const labelSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        polygonIdField: 'id',
      }),
    );

    labelSeries.bullets.push(() => {
      const label = am5.Label.new(root, {
        text: '{name}',
        populateText: true,
        centerX: am5.p50,
        centerY: am5.p50,
        fontSize: 10,
        fontWeight: '700',
        fill: am5.color(0x0f172a),
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.88,
          cornerRadiusTL: 5,
          cornerRadiusTR: 5,
          cornerRadiusBL: 5,
          cornerRadiusBR: 5,
          stroke: am5.color(0xe2e8f0),
          strokeWidth: 1,
        }),
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 6,
        paddingRight: 6,
      });
      return am5.Bullet.new(root, { sprite: label });
    });

    labelSeries.data.setAll(
      [...ORIGIN_IDS, INDIA_ID]
        .filter((id) => LABEL_IDS.has(id))
        .map((id) => ({
          id,
          name: id === INDIA_ID ? 'INDIA' : countryNames[id],
        })),
    );

    const sankeySeries = chart.series.push(
      am5map.MapSankeySeries.new(root, {
        polygonSeries,
        maxWidth: 3.2,
        controlPointDistance: 0.42,
        resolution: 64,
        nodePadding: 0.32,
      }),
    );

    sankeySeries.mapPolygons.template.setAll({
      fill: am5.color(0xea580c),
      fillOpacity: 0.78,
      strokeOpacity: 0,
      tooltipText: '{sourceNode.name} → India\nDigital business launch',
    });

    sankeySeries.nodes.mapPolygons.template.setAll({
      fill: am5.color(0xc2410c),
      stroke: am5.color(0xffedd5),
      strokeWidth: 1.6,
      fillOpacity: 0.96,
      strokeOpacity: 1,
      tooltipText: '{name}',
    });

    // Soft glow trail
    sankeySeries.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 0,
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0xf97316),
          fillOpacity: 0.22,
          visible: false,
        }),
      }),
    );

    // Bright payment packet
    sankeySeries.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 0,
        autoRotate: true,
        sprite: am5.Circle.new(root, {
          radius: 3.1,
          fill: am5.color(0xfbbf24),
          stroke: am5.color(0xffffff),
          strokeWidth: 1,
          shadowColor: am5.color(0xea580c),
          shadowBlur: 10,
          shadowOpacity: 0.65,
          visible: false,
        }),
      }),
    );

    sankeySeries.data.setAll(indiaLaunchRoutes);

    sankeySeries.events.on('datavalidated', () => {
      am5.array.each(sankeySeries.nodes.dataItems, (di) => {
        const id = di.get('id');
        if (id && countryNames[id]) di.set('name', countryNames[id]);
        const poly = di.get('mapPolygon');
        if (!poly || !id) return;
        if (id === INDIA_ID) {
          poly.setAll({
            fill: am5.color(0xea580c),
            stroke: am5.color(0xffffff),
            strokeWidth: 2.4,
          });
        }
      });

      am5.array.each(sankeySeries.dataItems, (dataItem, index) => {
        const bullets = dataItem.bullets;
        if (!bullets) return;
        am5.array.each(bullets, (bullet, bulletIndex) => {
          const dur = 1800 + Math.random() * 1600;
          const stagger = index * 70 + bulletIndex * 40;
          window.setTimeout(() => {
            const sprite = bullet.get('sprite');
            if (sprite && !sprite.isDisposed()) sprite.set('visible', true);
            if (!bullet.isDisposed()) {
              bullet.animate({
                key: 'locationX',
                from: 0,
                to: 1,
                duration: dur,
                easing: am5.ease.linear,
                loops: Infinity,
              });
            }
          }, stagger);
        });
      });
    });

    chart.goHome(0);
    chart.appear(700, 40);

    // Cinematic zoom into India across most of the 5s window
    const zoomTimer = window.setTimeout(() => {
      chart.zoomToGeoPoint({ longitude: 78.5, latitude: 22 }, 2.35, true, 2800);
    }, 550);

    // Final punch-in near end
    const punchTimer = window.setTimeout(() => {
      chart.zoomToGeoPoint({ longitude: 79, latitude: 22.5 }, 2.7, true, 900);
    }, 3600);

    return () => {
      window.clearTimeout(zoomTimer);
      window.clearTimeout(punchTimer);
      root.dispose();
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 1.85;
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);

  useEffect(() => {
    const step = durationMs / STATUS_LINES.length;
    const timers = STATUS_LINES.map((_, i) =>
      window.setTimeout(() => setStatusIndex(i), Math.min(step * i, durationMs - 180)),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [durationMs]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#F5F7FB] flex flex-col overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
          transition={{ duration: 0.75, ease }}
          aria-label="Loading nSERVE services"
          aria-live="polite"
          role="status"
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 72% 48%, rgba(234,88,12,0.2), transparent 42%), radial-gradient(ellipse at 18% 62%, rgba(14,165,233,0.12), transparent 40%), radial-gradient(ellipse at 48% 8%, rgba(245,158,11,0.1), transparent 38%)',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 z-[1] grid-bg opacity-25" aria-hidden="true" />

          {/* Moving spotlight toward India */}
          <motion.div
            className="pointer-events-none absolute z-[2] h-[42vmax] w-[42vmax] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(234,88,12,0.22) 0%, rgba(245,158,11,0.08) 42%, transparent 70%)',
            }}
            initial={{ left: '18%', top: '38%', opacity: 0.35 }}
            animate={{ left: '58%', top: '34%', opacity: 0.85 }}
            transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 22%, rgba(245,247,251,0.4) 62%, rgba(245,247,251,0.96) 100%)',
            }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease }}
          >
            <div ref={hostRef} className="w-full h-[95vh] max-w-full mx-auto" />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
            <motion.div
              className="flex flex-col items-center gap-1.5 pt-8 sm:pt-10"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/nservelogo.png"
                  alt=""
                  className="h-10 sm:h-12 w-auto object-contain"
                  aria-hidden="true"
                />
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  nSERVE
                </span>
              </div>
              <motion.p
                className="font-script text-3xl sm:text-4xl text-orange-600 leading-none"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                Digital Meets Direct
              </motion.p>
            </motion.div>

            <div className="flex-1" />

            <motion.div
              className="px-6 pb-10 sm:pb-12 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
            >
              <div className="text-center space-y-2 max-w-lg">
                <p className="font-display text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                  Payment Gateway · Cross Border.{' '}
                  <span className="text-gradient">One nSERVE.</span>
                </p>
                <div className="h-5 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={STATUS_LINES[statusIndex]}
                      className="text-sm text-slate-500 tracking-wide"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      {STATUS_LINES[statusIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Step dots — one per second */}
              <div className="flex items-center gap-2" aria-hidden="true">
                {STATUS_LINES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      i <= statusIndex
                        ? 'w-5 bg-orange-500'
                        : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="w-full max-w-[18rem] space-y-2">
                <div className="relative h-1.5 rounded-full bg-slate-200/90 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400"
                    style={{ width: `${progress}%` }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                    animate={{ left: ['-25%', '120%'] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  <span>Loading services</span>
                  <span className="tabular-nums text-orange-600 font-semibold">{progress}%</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                  Payment Gateway
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.7)]" />
                  Cross Border
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  One partner
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
