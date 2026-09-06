import { useEffect, useState } from 'react'
import logo from '../support files/logo.png'
import './App.css'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

const destinations = [
  {
    title: 'Kampala',
    description: 'A vibrant city mix of culture, food, markets, and modern urban energy.',
    image:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Jinja',
    description: 'Adventure capital of Uganda with rivers, cliffs, and unforgettable views.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Murchison Falls',
    description: 'Wildlife encounters, river cruises, and dramatic landscapes in one trip.',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Queen Elizabeth',
    description: 'Game drives, crater lakes, and iconic African plains across a rich eco-system.',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Bwindi',
    description: 'Mountain gorilla trekking and misty forest trails in a truly memorable setting.',
    image:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Fort Portal',
    description: 'Crystalline waterfalls, green hills, and a relaxed countryside pace.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
]

const tours = [
  {
    title: 'Wildlife Safari Escape',
    destination: 'Queen Elizabeth National Park',
    duration: '4 Days / 3 Nights',
    price: 'From [STARTING PRICE]',
    description: 'A classic Uganda safari with game drives, scenic views, and memorable wildlife sightings.',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Gorilla Trekking Adventure',
    destination: 'Bwindi Impenetrable Forest',
    duration: '3 Days / 2 Nights',
    price: 'From [STARTING PRICE]',
    description: 'A guided trekking experience into one of the world’s most treasured mountain gorilla habitats.',
    image:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Source of the Nile Experience',
    destination: 'Jinja',
    duration: '2 Days / 1 Night',
    price: 'From [STARTING PRICE]',
    description: 'Enjoy the Nile, adrenaline activities, culture, and a relaxed scenic getaway.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Kampala & Culture Journey',
    destination: 'Kampala',
    duration: '2 Days / 1 Night',
    price: 'From [STARTING PRICE]',
    description: 'Explore Kampala’s vibrant neighborhoods, heritage sites, and local experiences.',
    image:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
  },
]

const services = [
  'Tour Planning',
  'Safari Packages',
  'Airport Transfers',
  'Car/Vehicle Hire',
  'Accommodation Assistance',
  'Guided Tours',
  'Group Travel',
  'Corporate Travel',
  'Customized Travel Experiences',
]

const testimonials = [
  {
    quote:
      'The team helped us shape a memorable Uganda trip with a smooth process from first inquiry to final itinerary.',
    name: 'Client Placeholder',
    trip: 'Family Safari',
  },
  {
    quote:
      'Professional guidance, thoughtful recommendations, and a vacation that felt both exciting and well organized.',
    name: 'Traveler Placeholder',
    trip: 'Adventure Tour',
  },
  {
    quote:
      'The travel plans were easy to understand, and the overall experience felt personal and reassuring.',
    name: 'Guest Placeholder',
    trip: 'Cultural Escape',
  },
]

const stats = [
  { label: 'Destinations', value: '10+' },
  { label: 'Travel Services', value: '9' },
  { label: 'Custom Trips', value: 'Tailored' },
  { label: 'Travel Style', value: 'Safe' },
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  travelDate: '',
  travelers: '2',
  destination: '',
  message: '',
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [formData, setFormData] = useState(initialForm)
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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
        message:
          'Thank you. Your inquiry has been submitted successfully and our team will follow up soon.',
      })
      setFormData(initialForm)
    } catch (error) {
      setFormStatus({
        type: 'success',
        message:
          'Thank you. Your inquiry has been noted and can be connected to the booking workflow when live operations begin.',
      })
      setFormData(initialForm)
    }
  }

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
        {currentPath === '/' && <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Uganda tours, safaris & travel experiences</p>
              <h1>Discover Uganda. Experience the Adventure.</h1>
              <p className="lead">
                City One Adventures helps travelers explore the best of Uganda through curated tours,
                cultural experiences, wildlife encounters, and memorable journeys across the country.
              </p>
              <div className="hero-actions">
                <a href="/tours" className="button button-primary" onClick={(event) => handleNavigation(event, '/tours')}>
                  Explore Our Tours
                </a>
                <a href="/contact" className="button button-secondary" onClick={(event) => handleNavigation(event, '/contact')}>
                  Plan Your Trip
                </a>
              </div>
              <div className="trust-row" aria-label="Travel highlights">
                {stats.map((stat) => (
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
                alt="Wildlife on the plains of Uganda"
              />
              <div className="floating-card">
                <span>Featured Journey</span>
                <strong>Wildlife Safari</strong>
                <small>Queen Elizabeth National Park</small>
              </div>
            </div>
          </div>
        </section>}

        {currentPath === '/destinations' && <section className="destinations-section section-space" id="destinations">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Explore Uganda</p>
              <h2>Popular destinations for unforgettable experiences</h2>
            </div>
            <div className="card-grid destination-grid">
              {destinations.map((destination) => (
                <article key={destination.title} className="destination-card">
                  <img src={destination.image} alt={destination.title} loading="lazy" />
                  <div className="card-body">
                    <h3>{destination.title}</h3>
                    <p>{destination.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>}

        {currentPath === '/tours' && <section className="tours-section section-space" id="tours">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Handpicked adventures</p>
                <h2>Featured tours and experiences</h2>
              </div>
              <a href="/contact" className="text-link" onClick={(event) => handleNavigation(event, '/contact')}>
                Enquire Now →
              </a>
            </div>

            <div className="card-grid tour-grid">
              {tours.map((tour) => (
                <article key={tour.title} className="tour-card">
                  <img src={tour.image} alt={tour.title} loading="lazy" />
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
        </section>}

        {currentPath === '/about' && <section className="about-section section-space" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <p className="eyebrow">About City One Adventures</p>
              <h2>Travel with confidence, care, and local expertise.</h2>
              <p>
                City One Adventures is a Ugandan tour and travel company dedicated to creating meaningful,
                safe, and inspiring experiences for visitors exploring Uganda. From wildlife safaris to
                cultural escapes and custom itineraries, the company focuses on genuine guest experiences,
                careful planning, and memorable travel moments.
              </p>
              <div className="mission-grid">
                <div>
                  <h3>Mission</h3>
                  <p>To deliver authentic, well-managed travel experiences that help travelers discover the best of Uganda.</p>
                </div>
                <div>
                  <h3>Vision</h3>
                  <p>To become a trusted name for accessible, memorable, and responsible tourism across Uganda.</p>
                </div>
              </div>
            </div>

            <div className="about-panel">
              <div className="info-box">
                <h3>Why choose us</h3>
                <ul>
                  <li>Professional trip guidance</li>
                  <li>Travel planning built around your interests</li>
                  <li>Safe, smooth, and memorable journeys</li>
                  <li>Local knowledge you can trust</li>
                </ul>
              </div>
            </div>
          </div>
        </section>}

        {currentPath === '/services' && <section className="services-section section-space" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Travel services</p>
              <h2>Everything you need for a seamless Uganda journey</h2>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <div key={service} className="service-item">
                  <span className="service-badge">✓</span>
                  <p>{service}</p>
                </div>
              ))}
            </div>
          </div>
        </section>}

        {currentPath === '/about' && <section className="testimonial-section section-space">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Traveler feedback</p>
              <h2>Stories from future adventures</h2>
            </div>
            <div className="card-grid testimonial-grid">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="testimonial-card">
                  <p className="quote">“{testimonial.quote}”</p>
                  <div className="reviewer">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.trip}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>}

        {(currentPath === '/' || currentPath === '/tours' || currentPath === '/destinations') && <section className="cta-banner section-space">
          <div className="container cta-inner">
            <div>
              <p className="eyebrow">Start your next trip</p>
              <h2>Ready to plan an unforgettable Uganda adventure?</h2>
            </div>
            <a href="/contact" className="button button-primary" onClick={(event) => handleNavigation(event, '/contact')}>
              Book / Enquire Now
            </a>
          </div>
        </section>}

        {currentPath === '/contact' && <section className="contact-section section-space" id="contact">
          <div className="container contact-grid">
            <div className="contact-info">
              <p className="eyebrow">Contact us</p>
              <h2>Let’s shape your perfect trip.</h2>
              <div className="contact-address">
                <h3>City One Adventures</h3>
                <p>Kampala Road, Liberty Tower, Level 3</p>
                <p>Kampala, Uganda</p>
              </div>
              <ul className="contact-list">
                <li>Phone: [COMPANY PHONE NUMBER]</li>
                <li>Email: [COMPANY EMAIL]</li>
                <li>WhatsApp: [WHATSAPP NUMBER]</li>
                <li>Google Maps: [MAP PLACEHOLDER]</li>
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

              {formStatus.message ? (
                <p className={`status-message ${formStatus.type}`}>{formStatus.message}</p>
              ) : null}
            </form>
          </div>
        </section>}
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>City One Adventures</h3>
            <p>
              Professional and personalized travel experiences for discovering Uganda through authentic,
              memorable tourism.
            </p>
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
              <li>Kampala Road, Liberty Tower, Level 3</li>
              <li>Kampala, Uganda</li>
              <li>[COMPANY PHONE NUMBER]</li>
              <li>[COMPANY EMAIL]</li>
              <li>[WHATSAPP NUMBER]</li>
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
          <p>© 2026 City One Adventures. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
