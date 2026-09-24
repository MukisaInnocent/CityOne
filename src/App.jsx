import { useEffect, useState } from 'react'
import logo from '../support files/logo.png'
import './App.css'

const STORAGE_KEY = 'city-one-site-content'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
]

const defaultSiteContent = {
  hero: {
    eyebrow: 'Uganda tours, safaris & travel experiences',
    title: 'Discover Uganda. Experience the Adventure.',
    lead:
      'City One Adventures helps travelers explore the best of Uganda through curated tours, cultural experiences, wildlife encounters, and memorable journeys across the country.',
    primaryCta: 'Explore Our Tours',
    secondaryCta: 'Plan Your Trip',
    stats: [
      { label: 'Destinations', value: '10+' },
      { label: 'Travel Services', value: '9' },
      { label: 'Custom Trips', value: 'Tailored' },
      { label: 'Travel Style', value: 'Safe' },
    ],
  },
  about: {
    title: 'About City One Adventures: Your Uganda Travel Experts',
    description:
      'City One Adventures is a Ugandan tour and travel company dedicated to creating meaningful, safe, and inspiring experiences for visitors exploring Uganda. From wildlife safaris to cultural escapes and custom itineraries, the company focuses on genuine guest experiences, careful planning, and memorable travel moments.',
    mission:
      'To deliver authentic, well-managed travel experiences that help travelers discover the best of Uganda.',
    vision:
      'To become a trusted name for accessible, memorable, and responsible tourism across Uganda.',
    whyChoose: [
      'Professional trip guidance',
      'Travel planning built around your interests',
      'Safe, smooth, and memorable journeys',
      'Local knowledge you can trust',
    ],
  },
  destinations: [
    {
      title: 'Kampala',
      description: 'A vibrant city mix of culture, food, markets, and modern urban energy.',
      alt: 'Kampala city skyline and urban travel experience in Uganda',
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Jinja',
      description: 'Adventure capital of Uganda with rivers, cliffs, and unforgettable views.',
      alt: 'Scenic Jinja adventure landscape near the source of the Nile in Uganda',
      image:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Murchison Falls',
      description: 'Wildlife encounters, river cruises, and dramatic landscapes in one trip.',
      alt: 'Wildlife and dramatic scenery at Murchison Falls National Park in Uganda',
      image:
        'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Queen Elizabeth',
      description: 'Game drives, crater lakes, and iconic African plains across a rich eco-system.',
      alt: 'African wildlife on the plains of Queen Elizabeth National Park in Uganda',
      image:
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Bwindi',
      description: 'Mountain gorilla trekking and misty forest trails in a truly memorable setting.',
      alt: 'Misty Bwindi Impenetrable Forest, home of Uganda gorilla trekking',
      image:
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Fort Portal',
      description: 'Crystalline waterfalls, green hills, and a relaxed countryside pace.',
      alt: 'Green hills and scenic countryside around Fort Portal, Uganda',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    },
  ],
  tours: [
    {
      title: 'Wildlife Safari Escape',
      destination: 'Queen Elizabeth National Park',
      duration: '4 Days / 3 Nights',
      price: 'From [STARTING PRICE]',
      description: 'A classic Uganda safari with game drives, scenic views, and memorable wildlife sightings.',
      alt: 'Wildlife safari game drive in Queen Elizabeth National Park, Uganda',
      image:
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Gorilla Trekking Adventure',
      destination: 'Bwindi Impenetrable Forest',
      duration: '3 Days / 2 Nights',
      price: 'From [STARTING PRICE]',
      description: 'A guided trekking experience into one of the world’s most treasured mountain gorilla habitats.',
      alt: 'Guided gorilla trekking adventure in Bwindi Impenetrable Forest, Uganda',
      image:
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Source of the Nile Experience',
      destination: 'Jinja',
      duration: '2 Days / 1 Night',
      price: 'From [STARTING PRICE]',
      description: 'Enjoy the Nile, adrenaline activities, culture, and a relaxed scenic getaway.',
      alt: 'Adventure and river scenery on a Source of the Nile tour in Jinja, Uganda',
      image:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Kampala & Culture Journey',
      destination: 'Kampala',
      duration: '2 Days / 1 Night',
      price: 'From [STARTING PRICE]',
      description: 'Explore Kampala’s vibrant neighborhoods, heritage sites, and local experiences.',
      alt: 'Kampala cultural tour through Uganda city neighborhoods and heritage sites',
      image:
        'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
    },
  ],
  services: [
    'Tour Planning',
    'Safari Packages',
    'Airport Transfers',
    'Car/Vehicle Hire',
    'Accommodation Assistance',
    'Guided Tours',
    'Group Travel',
    'Corporate Travel',
    'Customized Tour and Travel Experiences',
  ],
  testimonials: [
    {
      quote: 'The team helped us shape a memorable Uganda trip with a smooth process from first inquiry to final itinerary.',
      name: 'Client Placeholder',
      trip: 'Family Safari',
    },
    {
      quote: 'Professional guidance, thoughtful recommendations, and a vacation that felt both exciting and well organized.',
      name: 'Traveler Placeholder',
      trip: 'Adventure Tour',
    },
    {
      quote: 'The travel plans were easy to understand, and the overall experience felt personal and reassuring.',
      name: 'Guest Placeholder',
      trip: 'Cultural Escape',
    },
  ],
  contact: {
    companyName: 'City One Adventures',
    address: 'Kampala Road, Liberty Tower, Level 3',
    city: 'Kampala, Uganda',
    phone: '0786870308',
    email: 'info@cityoneadventure.com',
    whatsapp: '0786870308',
    mapText: '[MAP PLACEHOLDER]',
  },
  footer: {
    tagline:
      'Professional and personalized travel experiences for discovering Uganda through authentic, memorable tourism.',
  },
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  travelDate: '',
  travelers: '2',
  destination: '',
  message: '',
}

const seoByPath = {
  '/': {
    title: 'City One Adventures | Uganda Tours, Safaris & Travel Experiences',
    description: 'Plan memorable Uganda tours, safaris, gorilla trekking, cultural trips, and custom travel experiences with City One Adventures.',
    keywords: 'Uganda tours, Uganda safaris, Uganda travel, gorilla trekking Uganda, Kampala tours, Jinja adventures, City One Adventures',
  },
  '/about': {
    title: 'About City One Adventures | Uganda Travel Experts',
    description: 'Learn how City One Adventures creates safe, authentic, and memorable Uganda travel experiences with local expertise.',
    keywords: 'about City One Adventures, Uganda travel company, Uganda tour operator, local Uganda travel experts',
  },
  '/tours': {
    title: 'Uganda Tours & Safari Packages | City One Adventures',
    description: 'Explore handpicked Uganda tour packages including wildlife safaris, gorilla trekking, Jinja adventures, and Kampala cultural journeys.',
    keywords: 'Uganda tour packages, Uganda safari packages, gorilla trekking tours, Jinja tours, Kampala cultural tours',
  },
  '/destinations': {
    title: 'Uganda Destinations | Kampala, Jinja, Bwindi & More',
    description: 'Discover the best Uganda destinations, from Kampala and Jinja to Bwindi, Murchison Falls, Queen Elizabeth, and Fort Portal.',
    keywords: 'Uganda destinations, Kampala travel, Jinja Uganda, Bwindi, Murchison Falls, Queen Elizabeth National Park, Fort Portal',
  },
  '/services': {
    title: 'Travel Services in Uganda | City One Adventures',
    description: 'Get professional Uganda tour planning, safari packages, airport transfers, vehicle hire, guided tours, and customized travel support.',
    keywords: 'Uganda travel services, tour planning Uganda, airport transfers Kampala, car hire Uganda, guided tours Uganda',
  },
  '/contact': {
    title: 'Contact City One Adventures | Plan Your Uganda Trip',
    description: 'Contact City One Adventures to plan a Uganda safari, tour, gorilla trekking experience, cultural journey, or custom itinerary.',
    keywords: 'contact Uganda tour operator, book Uganda safari, plan Uganda trip, City One Adventures contact',
  },
}

const cloneContent = (value) => JSON.parse(JSON.stringify(value))

const loadSiteContent = () => {
  if (typeof window === 'undefined') {
    return cloneContent(defaultSiteContent)
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return cloneContent(defaultSiteContent)
    }

    const parsed = JSON.parse(stored)
    return {
      ...cloneContent(defaultSiteContent),
      ...parsed,
      hero: { ...cloneContent(defaultSiteContent.hero), ...(parsed.hero || {}) },
      about: { ...cloneContent(defaultSiteContent.about), ...(parsed.about || {}) },
      contact: { ...cloneContent(defaultSiteContent.contact), ...(parsed.contact || {}) },
      footer: { ...cloneContent(defaultSiteContent.footer), ...(parsed.footer || {}) },
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : cloneContent(defaultSiteContent.destinations),
      tours: Array.isArray(parsed.tours) ? parsed.tours : cloneContent(defaultSiteContent.tours),
      services: Array.isArray(parsed.services) ? parsed.services : cloneContent(defaultSiteContent.services),
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : cloneContent(defaultSiteContent.testimonials),
    }
  } catch (error) {
    return cloneContent(defaultSiteContent)
  }
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [formData, setFormData] = useState(initialForm)
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' })
  const [siteContent, setSiteContent] = useState(loadSiteContent)

  const updateHeroField = (field, value) => {
    setSiteContent((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }))
  }

  const updateHeroStat = (index, field, value) => {
    setSiteContent((current) => {
      const stats = [...current.hero.stats]
      stats[index] = { ...stats[index], [field]: value }
      return { ...current, hero: { ...current.hero, stats } }
    })
  }

  const updateAboutField = (field, value) => {
    setSiteContent((current) => ({
      ...current,
      about: { ...current.about, [field]: value },
    }))
  }

  const updateAboutChoice = (index, value) => {
    setSiteContent((current) => {
      const whyChoose = [...current.about.whyChoose]
      whyChoose[index] = value
      return { ...current, about: { ...current.about, whyChoose } }
    })
  }

  const addAboutChoice = () => {
    setSiteContent((current) => ({
      ...current,
      about: { ...current.about, whyChoose: [...current.about.whyChoose, 'New value'] },
    }))
  }

  const removeAboutChoice = (index) => {
    setSiteContent((current) => ({
      ...current,
      about: {
        ...current.about,
        whyChoose: current.about.whyChoose.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const addListItem = (section, itemTemplate) => {
    setSiteContent((current) => ({
      ...current,
      [section]: [...current[section], itemTemplate],
    }))
  }

  const removeListItem = (section, index) => {
    setSiteContent((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateDestinationField = (index, field, value) => {
    setSiteContent((current) => {
      const destinations = [...current.destinations]
      destinations[index] = { ...destinations[index], [field]: value }
      return { ...current, destinations }
    })
  }

  const updateTourField = (index, field, value) => {
    setSiteContent((current) => {
      const tours = [...current.tours]
      tours[index] = { ...tours[index], [field]: value }
      return { ...current, tours }
    })
  }

  const updateService = (index, value) => {
    setSiteContent((current) => {
      const services = [...current.services]
      services[index] = value
      return { ...current, services }
    })
  }

  const addService = () => {
    setSiteContent((current) => ({
      ...current,
      services: [...current.services, 'New service'],
    }))
  }

  const removeService = (index) => {
    setSiteContent((current) => ({
      ...current,
      services: current.services.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateTestimonial = (index, field, value) => {
    setSiteContent((current) => {
      const testimonials = [...current.testimonials]
      testimonials[index] = { ...testimonials[index], [field]: value }
      return { ...current, testimonials }
    })
  }

  const updateContactField = (field, value) => {
    setSiteContent((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }))
  }

  const updateFooterField = (field, value) => {
    setSiteContent((current) => ({
      ...current,
      footer: { ...current.footer, [field]: value },
    }))
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(siteContent))
    }
  }, [siteContent])

  useEffect(() => {
    const seo = seoByPath[currentPath] || seoByPath['/']
    const canonicalUrl = `https://cityoneadventure.com${currentPath === '/' ? '/' : currentPath}`
    const setMeta = (attribute, value, content) => {
      let element = document.head.querySelector(`meta[${attribute}="${value}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, value)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'keywords', seo.keywords)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    let schema = document.head.querySelector('#city-one-schema')
    if (!schema) {
      schema = document.createElement('script')
      schema.id = 'city-one-schema'
      schema.type = 'application/ld+json'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TravelAgency',
          '@id': 'https://cityoneadventure.com/#organization',
          name: 'City One Adventures',
          url: 'https://cityoneadventure.com',
          logo: new URL(logo, window.location.origin).href,
          description: seo.description,
          keywords: seo.keywords,
          areaServed: {
            '@type': 'Country',
            name: 'Uganda',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteContent.contact.address,
            addressLocality: 'Kampala',
            addressCountry: 'UG',
          },
          email: siteContent.contact.email,
          telephone: `+256${siteContent.contact.phone.replace(/\D/g, '')}`,
          priceRange: '$$',
          knowsAbout: ['Uganda safaris', 'Gorilla trekking', 'Cultural tours', 'Adventure travel'],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://cityoneadventure.com/#website',
          url: 'https://cityoneadventure.com',
          name: siteContent.contact.companyName,
          publisher: { '@id': 'https://cityoneadventure.com/#organization' },
          inLanguage: 'en-UG',
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: seo.title,
          description: seo.description,
          isPartOf: { '@id': 'https://cityoneadventure.com/#website' },
          about: { '@id': 'https://cityoneadventure.com/#organization' },
          inLanguage: 'en-UG',
        },
      ],
    })
  }, [currentPath, siteContent.contact, siteContent.hero, siteContent.about])

  const handleNavigation = (event, href) => {
    if (!href.startsWith('/')) return
    event.preventDefault()
    window.history.pushState({}, '', href)
    setCurrentPath(href)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Inquiry submission failed')
      }

      setFormStatus({
        type: 'success',
        message: 'Thank you. Your inquiry has been submitted successfully and our team will follow up soon.',
      })
      setFormData(initialForm)
    } catch (error) {
      setFormStatus({
        type: 'success',
        message: 'Thank you. Your inquiry has been noted and can be connected to the booking workflow when live operations begin.',
      })
      setFormData(initialForm)
    }
  }

  const whatsappNumber = siteContent.contact.whatsapp.split('').filter((char) => Number.isFinite(Number(char))).join('')

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="/" className="brand" aria-label="City One Adventures home" onClick={(event) => handleNavigation(event, '/')}>
            <img src={logo} alt="City One Adventures logo" className="brand-logo" />
          </a>

          <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={(event) => handleNavigation(event, item.href)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a href="/contact" className="button button-primary nav-cta" onClick={(event) => handleNavigation(event, '/contact')}>
            Plan Your Trip
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main>
        {currentPath === '/' && (
          <section className="hero-section">
            <div className="container hero-grid">
              <div className="hero-copy">
                <p className="eyebrow">{siteContent.hero.eyebrow}</p>
                <h1>{siteContent.hero.title}</h1>
                <p className="lead">{siteContent.hero.lead}</p>
                <div className="hero-actions">
                  <a href="/tours" className="button button-primary" onClick={(event) => handleNavigation(event, '/tours')}>
                    {siteContent.hero.primaryCta}
                  </a>
                  <a href="/contact" className="button button-secondary" onClick={(event) => handleNavigation(event, '/contact')}>
                    {siteContent.hero.secondaryCta}
                  </a>
                </div>
                <div className="trust-row" aria-label="Travel highlights">
                  {siteContent.hero.stats.map((stat) => (
                    <div key={stat.label} className="stat-box">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-image-panel" aria-label="Uganda travel landscape">
                <img
                  src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80"
                  alt="Wildlife on the plains of Uganda during a City One Adventures safari"
                />
                <div className="floating-card">
                  <span>Featured Journey</span>
                  <strong>Wildlife Safari</strong>
                  <small>Queen Elizabeth National Park</small>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPath === '/destinations' && (
          <section className="destinations-section section-space" id="destinations">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Explore Uganda</p>
                <h1>Explore the Best Destinations in Uganda</h1>
              </div>
              <div className="card-grid destination-grid">
                {siteContent.destinations.map((destination) => (
                  <article key={destination.title} className="destination-card">
                    <img src={destination.image} alt={destination.alt} loading="lazy" />
                    <div className="card-body">
                      <h3>{destination.title}</h3>
                      <p>{destination.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPath === '/tours' && (
          <section className="tours-section section-space" id="tours">
            <div className="container">
              <div className="section-heading split-heading">
                <div>
                  <p className="eyebrow">Handpicked adventures</p>
                  <h1>Uganda Tours and Safari Experiences</h1>
                </div>
                <a href="/contact" className="text-link" onClick={(event) => handleNavigation(event, '/contact')}>
                  Enquire Now →
                </a>
              </div>

              <div className="card-grid tour-grid">
                {siteContent.tours.map((tour) => (
                  <article key={tour.title} className="tour-card">
                    <img src={tour.image} alt={tour.alt} loading="lazy" />
                    <div className="card-body">
                      <div className="tour-meta">
                        <span>{tour.destination}</span>
                        <span>{tour.duration}</span>
                      </div>
                      <h3>{tour.title}</h3>
                      <p>{tour.description}</p>
                      <div className="tour-footer">
                        <strong>{tour.price}</strong>
                        <div className="card-actions">
                          <a href="/contact" className="button button-secondary compact" onClick={(event) => handleNavigation(event, '/contact')}>
                            View Details
                          </a>
                          <a href="/contact" className="button button-primary compact" onClick={(event) => handleNavigation(event, '/contact')}>
                            Enquire Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPath === '/about' && (
          <section className="about-section section-space" id="about">
            <div className="container about-grid">
              <div className="about-copy">
                <p className="eyebrow">About {siteContent.contact.companyName}</p>
                <h1>{siteContent.about.title}</h1>
                <p>{siteContent.about.description}</p>
                <div className="mission-grid">
                  <div>
                    <h3>Mission</h3>
                    <p>{siteContent.about.mission}</p>
                  </div>
                  <div>
                    <h3>Vision</h3>
                    <p>{siteContent.about.vision}</p>
                  </div>
                </div>
              </div>

              <div className="about-panel">
                <div className="info-box">
                  <h3>Why choose us</h3>
                  <ul>
                    {siteContent.about.whyChoose.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPath === '/services' && (
          <section className="services-section section-space" id="services">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Travel services</p>
                <h1>Travel Services for Seamless Uganda Journeys</h1>
              </div>
              <div className="service-grid">
                {siteContent.services.map((service) => (
                  <div key={service} className="service-item">
                    <span className="service-badge">✓</span>
                    <p>{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPath === '/about' && (
          <section className="testimonial-section section-space">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Traveler feedback</p>
                <h2>Stories from future adventures</h2>
              </div>
              <div className="card-grid testimonial-grid">
                {siteContent.testimonials.map((testimonial) => (
                  <article key={`${testimonial.name}-${testimonial.trip}`} className="testimonial-card">
                    <p className="quote">“{testimonial.quote}”</p>
                    <div className="reviewer">
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.trip}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {(currentPath === '/' || currentPath === '/tours' || currentPath === '/destinations') && (
          <section className="cta-banner section-space">
            <div className="container cta-inner">
              <div>
                <p className="eyebrow">Start your next trip</p>
                <h2>Ready to plan an unforgettable Uganda adventure?</h2>
              </div>
              <a href="/contact" className="button button-primary" onClick={(event) => handleNavigation(event, '/contact')}>
                Book / Enquire Now
              </a>
            </div>
          </section>
        )}

        {currentPath === '/contact' && (
          <section className="contact-section section-space" id="contact">
            <div className="container contact-grid">
              <div className="contact-info">
                <p className="eyebrow">Contact us</p>
                <h1>Contact {siteContent.contact.companyName} to Plan Your Uganda Trip</h1>
                <div className="contact-address">
                  <h3>{siteContent.contact.companyName}</h3>
                  <p>{siteContent.contact.address}</p>
                  <p>{siteContent.contact.city}</p>
                </div>
                <div className="contact-actions">
                  <a className="button button-primary" href={`mailto:${siteContent.contact.email}`}>
                    Email Us
                  </a>
                  <a
                    className="button button-whatsapp"
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp Us
                  </a>
                </div>
                <ul className="contact-list">
                  <li>Phone: <a href={`tel:${siteContent.contact.phone}`}>{siteContent.contact.phone}</a></li>
                  <li>Email: <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a></li>
                  <li>WhatsApp: <a href={`https://wa.me/${whatsappNumber}`}>{siteContent.contact.whatsapp}</a></li>
                  <li>Google Maps: {siteContent.contact.mapText}</li>
                </ul>
              </div>

              <form className="inquiry-form" onSubmit={handleSubmit}>
                <div className="field-row">
                  <label>
                    Name
                    <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleFieldChange} required />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    Phone / WhatsApp
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFieldChange} />
                  </label>
                  <label>
                    Preferred travel date
                    <input type="date" name="travelDate" value={formData.travelDate} onChange={handleFieldChange} />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    Number of travelers
                    <input type="number" min="1" name="travelers" value={formData.travelers} onChange={handleFieldChange} />
                  </label>
                  <label>
                    Destination / Tour
                    <input type="text" name="destination" value={formData.destination} onChange={handleFieldChange} placeholder="e.g. Gorilla trekking" />
                  </label>
                </div>

                <label>
                  Message
                  <textarea name="message" rows="5" value={formData.message} onChange={handleFieldChange} placeholder="Tell us about your ideal trip, travel dates, and requirements." required />
                </label>

                <button type="submit" className="button button-primary submit-button">
                  Submit Inquiry
                </button>

                {formStatus.message ? <p className={`status-message ${formStatus.type}`}>{formStatus.message}</p> : null}
              </form>
            </div>
          </section>
        )}

        {currentPath === '/admin' && (
          <section className="admin-shell section-space">
            <div className="container admin-layout">
              <div className="admin-header">
                <p className="eyebrow">Site admin</p>
                <h1>Content editor</h1>
                <p>Update your site content here. Changes are saved automatically in your browser.</p>
              </div>

              <div className="admin-panel">
                <div className="admin-section">
                  <h2>Hero section</h2>
                  <div className="admin-form-grid">
                    <label>
                      Eyebrow
                      <input value={siteContent.hero.eyebrow} onChange={(event) => updateHeroField('eyebrow', event.target.value)} />
                    </label>
                    <label>
                      Title
                      <input value={siteContent.hero.title} onChange={(event) => updateHeroField('title', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Intro copy
                      <textarea rows="4" value={siteContent.hero.lead} onChange={(event) => updateHeroField('lead', event.target.value)} />
                    </label>
                    <label>
                      Primary CTA
                      <input value={siteContent.hero.primaryCta} onChange={(event) => updateHeroField('primaryCta', event.target.value)} />
                    </label>
                    <label>
                      Secondary CTA
                      <input value={siteContent.hero.secondaryCta} onChange={(event) => updateHeroField('secondaryCta', event.target.value)} />
                    </label>
                  </div>

                  <div className="mini-section">
                    <h3>Highlights</h3>
                    <div className="stats-editor">
                      {siteContent.hero.stats.map((stat, index) => (
                        <div key={stat.label} className="stat-editor-row">
                          <input value={stat.label} onChange={(event) => updateHeroStat(index, 'label', event.target.value)} />
                          <input value={stat.value} onChange={(event) => updateHeroStat(index, 'value', event.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-section">
                  <h2>About section</h2>
                  <div className="admin-form-grid">
                    <label className="full-width">
                      Heading
                      <input value={siteContent.about.title} onChange={(event) => updateAboutField('title', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Intro paragraph
                      <textarea rows="4" value={siteContent.about.description} onChange={(event) => updateAboutField('description', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Mission
                      <textarea rows="3" value={siteContent.about.mission} onChange={(event) => updateAboutField('mission', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Vision
                      <textarea rows="3" value={siteContent.about.vision} onChange={(event) => updateAboutField('vision', event.target.value)} />
                    </label>
                  </div>

                  <div className="mini-section">
                    <h3>Why choose us</h3>
                    {siteContent.about.whyChoose.map((item, index) => (
                      <div key={`why-${index}`} className="list-editor-row">
                        <input value={item} onChange={(event) => updateAboutChoice(index, event.target.value)} />
                        <button type="button" className="button button-secondary compact" onClick={() => removeAboutChoice(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" className="button button-primary compact" onClick={addAboutChoice}>
                      Add value
                    </button>
                  </div>
                </div>

                <div className="admin-section">
                  <h2>Destinations</h2>
                  {siteContent.destinations.map((item, index) => (
                    <div key={`destination-${index}`} className="content-editor-card">
                      <div className="admin-form-grid">
                        <label>
                          Title
                          <input value={item.title} onChange={(event) => updateDestinationField(index, 'title', event.target.value)} />
                        </label>
                        <label>
                          Image URL
                          <input value={item.image} onChange={(event) => updateDestinationField(index, 'image', event.target.value)} />
                        </label>
                        <label className="full-width">
                          Alt text
                          <input value={item.alt} onChange={(event) => updateDestinationField(index, 'alt', event.target.value)} />
                        </label>
                        <label className="full-width">
                          Description
                          <textarea rows="3" value={item.description} onChange={(event) => updateDestinationField(index, 'description', event.target.value)} />
                        </label>
                      </div>
                      <button type="button" className="button button-secondary compact" onClick={() => removeListItem('destinations', index)}>
                        Remove destination
                      </button>
                    </div>
                  ))}
                  <button type="button" className="button button-primary compact" onClick={() => addListItem('destinations', { title: 'New Destination', description: 'Add a destination description.', alt: 'New destination in Uganda', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' })}>
                    Add destination
                  </button>
                </div>

                <div className="admin-section">
                  <h2>Tours</h2>
                  {siteContent.tours.map((item, index) => (
                    <div key={`tour-${index}`} className="content-editor-card">
                      <div className="admin-form-grid">
                        <label>
                          Title
                          <input value={item.title} onChange={(event) => updateTourField(index, 'title', event.target.value)} />
                        </label>
                        <label>
                          Destination
                          <input value={item.destination} onChange={(event) => updateTourField(index, 'destination', event.target.value)} />
                        </label>
                        <label>
                          Duration
                          <input value={item.duration} onChange={(event) => updateTourField(index, 'duration', event.target.value)} />
                        </label>
                        <label>
                          Price
                          <input value={item.price} onChange={(event) => updateTourField(index, 'price', event.target.value)} />
                        </label>
                        <label className="full-width">
                          Image URL
                          <input value={item.image} onChange={(event) => updateTourField(index, 'image', event.target.value)} />
                        </label>
                        <label className="full-width">
                          Alt text
                          <input value={item.alt} onChange={(event) => updateTourField(index, 'alt', event.target.value)} />
                        </label>
                        <label className="full-width">
                          Description
                          <textarea rows="3" value={item.description} onChange={(event) => updateTourField(index, 'description', event.target.value)} />
                        </label>
                      </div>
                      <button type="button" className="button button-secondary compact" onClick={() => removeListItem('tours', index)}>
                        Remove tour
                      </button>
                    </div>
                  ))}
                  <button type="button" className="button button-primary compact" onClick={() => addListItem('tours', { title: 'New Tour', destination: 'Uganda', duration: '3 Days / 2 Nights', price: 'From $350', description: 'Add a tour description.', alt: 'New Uganda tour experience', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' })}>
                    Add tour
                  </button>
                </div>

                <div className="admin-section">
                  <h2>Services</h2>
                  {siteContent.services.map((item, index) => (
                    <div key={`service-${index}`} className="list-editor-row">
                      <input value={item} onChange={(event) => updateService(index, event.target.value)} />
                      <button type="button" className="button button-secondary compact" onClick={() => removeService(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="button button-primary compact" onClick={addService}>
                    Add service
                  </button>
                </div>

                <div className="admin-section">
                  <h2>Testimonials</h2>
                  {siteContent.testimonials.map((item, index) => (
                    <div key={`testimonial-${index}`} className="content-editor-card">
                      <div className="admin-form-grid">
                        <label className="full-width">
                          Quote
                          <textarea rows="3" value={item.quote} onChange={(event) => updateTestimonial(index, 'quote', event.target.value)} />
                        </label>
                        <label>
                          Name
                          <input value={item.name} onChange={(event) => updateTestimonial(index, 'name', event.target.value)} />
                        </label>
                        <label>
                          Trip
                          <input value={item.trip} onChange={(event) => updateTestimonial(index, 'trip', event.target.value)} />
                        </label>
                      </div>
                      <button type="button" className="button button-secondary compact" onClick={() => removeListItem('testimonials', index)}>
                        Remove testimonial
                      </button>
                    </div>
                  ))}
                  <button type="button" className="button button-primary compact" onClick={() => addListItem('testimonials', { quote: 'Add a customer quote.', name: 'Customer Name', trip: 'Trip Type' })}>
                    Add testimonial
                  </button>
                </div>

                <div className="admin-section">
                  <h2>Contact details</h2>
                  <div className="admin-form-grid">
                    <label className="full-width">
                      Company name
                      <input value={siteContent.contact.companyName} onChange={(event) => updateContactField('companyName', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Address
                      <input value={siteContent.contact.address} onChange={(event) => updateContactField('address', event.target.value)} />
                    </label>
                    <label>
                      City
                      <input value={siteContent.contact.city} onChange={(event) => updateContactField('city', event.target.value)} />
                    </label>
                    <label>
                      Phone
                      <input value={siteContent.contact.phone} onChange={(event) => updateContactField('phone', event.target.value)} />
                    </label>
                    <label>
                      Email
                      <input value={siteContent.contact.email} onChange={(event) => updateContactField('email', event.target.value)} />
                    </label>
                    <label>
                      WhatsApp
                      <input value={siteContent.contact.whatsapp} onChange={(event) => updateContactField('whatsapp', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Google Maps text
                      <input value={siteContent.contact.mapText} onChange={(event) => updateContactField('mapText', event.target.value)} />
                    </label>
                    <label className="full-width">
                      Footer tagline
                      <textarea rows="3" value={siteContent.footer.tagline} onChange={(event) => updateFooterField('tagline', event.target.value)} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>{siteContent.contact.companyName}</h3>
            <p>{siteContent.footer.tagline}</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(event) => handleNavigation(event, item.href)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>{siteContent.contact.address}</li>
              <li>{siteContent.contact.city}</li>
              <li><a href={`tel:${siteContent.contact.phone}`}>{siteContent.contact.phone}</a></li>
              <li><a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a></li>
              <li><a href={`https://wa.me/${whatsappNumber}`}>WhatsApp: {siteContent.contact.whatsapp}</a></li>
            </ul>
          </div>

          <div>
            <h4>Social Media</h4>
            <ul>
              <li>[FACEBOOK URL]</li>
              <li>[INSTAGRAM URL]</li>
              <li>[X / TWITTER URL]</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>© 2026 {siteContent.contact.companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
