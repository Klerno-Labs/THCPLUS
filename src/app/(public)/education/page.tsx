'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { FlaskConical, Scale, BookOpen, Leaf, AlertCircle, CheckCircle, Info } from 'lucide-react'

const cannabinoids = [
  {
    name: 'THCA',
    description:
      'The acidic precursor to THC. Non-psychoactive in its raw form but converts to THC when heated (decarboxylation).',
    effects: ['Anti-inflammatory', 'Neuroprotective', 'Anti-nausea', 'Non-intoxicating when raw'],
  },
  {
    name: 'HHC',
    description:
      'Hexahydrocannabinol is a hydrogenated form of THC. It provides effects similar to THC with potentially longer shelf stability.',
    effects: ['Euphoria', 'Relaxation', 'Pain relief', 'Mood elevation'],
  },
  {
    name: 'CBD',
    description:
      'Cannabidiol is non-psychoactive and widely used for its potential therapeutic benefits without the "high" associated with THC.',
    effects: ['Anxiety relief', 'Pain management', 'Anti-inflammatory', 'Sleep support'],
  },
  {
    name: 'CBN',
    description:
      'Cannabinol is a mildly psychoactive cannabinoid that forms as THC ages. Often associated with sedative effects.',
    effects: ['Sedation', 'Sleep aid', 'Pain relief', 'Appetite stimulation'],
  },
]

const productTypes = [
  {
    name: 'Flower',
    description:
      'The dried and cured buds of the hemp plant. Can be smoked, vaporized, or used for cooking.',
    icon: Leaf,
  },
  {
    name: 'Edibles',
    description:
      'Food products infused with cannabinoids. Effects take longer to onset but last longer than inhalation.',
    icon: Info,
  },
  {
    name: 'Vapes',
    description:
      'Vaporizer cartridges and disposables. Provide fast-acting effects with discretion and convenience.',
    icon: FlaskConical,
  },
  {
    name: 'Tinctures',
    description:
      'Liquid extracts taken sublingually. Offer precise dosing and faster absorption than edibles.',
    icon: FlaskConical,
  },
]

export default function EducationPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Education Hub</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Knowledge is power. Learn about cannabinoids, product types, and the legal landscape of
            hemp-derived products.
          </p>
        </div>
      </section>

      {/* Cannabinoids Section */}
      <section id="cannabinoids" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Understanding Cannabinoids
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cannabinoids are naturally occurring compounds found in the cannabis plant. Each has
              unique properties and effects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cannabinoids.map((cannabinoid, index) => (
              <motion.div
                key={cannabinoid.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-primary">{cannabinoid.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{cannabinoid.description}</p>
                    <div>
                      <p className="font-medium text-sm text-primary mb-2">Common Effects:</p>
                      <ul className="space-y-1">
                        {cannabinoid.effects.map((effect) => (
                          <li key={effect} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Section */}
      <section id="legal" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Legal Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding the legal status of hemp-derived products.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-6 w-6 text-secondary mr-3" />
                    The 2018 Farm Bill
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The Agriculture Improvement Act of 2018 (2018 Farm Bill) federally legalized
                    hemp and hemp-derived products containing less than 0.3% THC by dry weight. This
                    landmark legislation removed hemp from the Controlled Substances Act and opened
                    the door for legal hemp production and sales across the United States.
                  </p>
                  <p className="text-gray-600">
                    Under this law, hemp-derived cannabinoids like HHC, THCA, and CBD are federally
                    legal as long as they come from compliant hemp plants. However, state laws may
                    vary, so it&apos;s important to understand your local regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    Texas Hemp Laws
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Texas has embraced the federal hemp framework. House Bill 1325 (2019) legalized
                    hemp and hemp-derived products in Texas, aligning with federal regulations.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Hemp-derived products with less than 0.3% THC are legal
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      No state license required to purchase hemp products
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Must be 21+ to purchase hemp products
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                    Important Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Hemp-derived cannabinoids may show up on drug tests
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Laws can change; always stay informed about current regulations
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Do not drive or operate machinery while under the influence
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Consult with a healthcare provider if you have medical concerns
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Product Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hemp products come in many forms, each with its own benefits and use cases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productTypes.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <product.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Testing Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FlaskConical className="h-16 w-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Lab Testing Matters</h2>
            <p className="text-lg text-gray-300 mb-8">
              All products at 3rd Coast Smoke Company undergo rigorous third-party laboratory
              testing. This ensures our products are safe, accurately labeled, and free from harmful
              contaminants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-2">Potency Testing</h3>
                <p className="text-gray-300 text-sm">
                  Verifies cannabinoid content matches label claims for accurate dosing.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-2">Contaminant Screening</h3>
                <p className="text-gray-300 text-sm">
                  Tests for pesticides, heavy metals, mold, and other harmful substances.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-2">Terpene Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Identifies the aromatic compounds that contribute to effects and flavor.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dosage Guidelines Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
              Dosage Guidelines
            </h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Start Low and Go Slow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The golden rule for hemp-derived cannabinoids is to start with a low dose and
                  gradually increase until you find your optimal dosage. Everyone&apos;s tolerance
                  and body chemistry is different.
                </p>
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">Beginners (Low Tolerance)</h4>
                    <p className="text-sm text-gray-600">
                      5-10mg THC equivalent | Wait 2 hours before increasing dose (edibles) or 30
                      minutes (vapes/flower)
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">
                      Intermediate (Moderate Tolerance)
                    </h4>
                    <p className="text-sm text-gray-600">
                      10-20mg THC equivalent | Effects may be felt more quickly, still wait adequate
                      time between doses
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">
                      Experienced (High Tolerance)
                    </h4>
                    <p className="text-sm text-gray-600">
                      20mg+ THC equivalent | Know your limits and always consume responsibly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                  Consumption Method Timing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary">Vapes/Smoking:</strong> Effects in 5-15
                      minutes, peak at 30-60 minutes, last 2-4 hours
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary">Tinctures (Sublingual):</strong> Effects in
                      15-45 minutes, peak at 1-2 hours, last 4-6 hours
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary">Edibles:</strong> Effects in 45 minutes-2
                      hours, peak at 2-4 hours, last 6-8 hours
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Storage & Safety Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
              Storage & Safety Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Proper Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Store in a cool, dark place away from direct sunlight
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Keep in airtight containers to preserve freshness
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Refrigeration can extend shelf life for some products
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Keep away from heat sources and humidity
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Always store out of reach of children and pets
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Never drive or operate machinery while impaired
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Avoid mixing with alcohol or other substances
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Consult doctor if pregnant, nursing, or on medications
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Start with lower doses if new to cannabinoids
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      Be aware products may appear on drug tests
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* First-Time User Tips */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
              First-Time User Tips
            </h2>
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Choose the Right Environment
                    </h3>
                    <p className="text-gray-600 ml-8">
                      Use hemp products in a comfortable, familiar setting. Being at home with
                      trusted friends or alone in a relaxed environment is ideal for your first
                      experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Clear Your Schedule
                    </h3>
                    <p className="text-gray-600 ml-8">
                      Don&apos;t have any obligations or responsibilities for several hours after
                      consuming. Give yourself time to fully experience the effects without stress.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Stay Hydrated & Have Snacks
                    </h3>
                    <p className="text-gray-600 ml-8">
                      Keep water and light snacks nearby. Cannabinoids can cause dry mouth and may
                      increase appetite. Having refreshments on hand enhances comfort.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Be Patient with Edibles
                    </h3>
                    <p className="text-gray-600 ml-8">
                      If trying edibles, resist the urge to take more if you don&apos;t feel effects
                      immediately. It can take up to 2 hours for edibles to kick in. Wait at least 2
                      hours before considering an additional dose.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                      <Info className="h-6 w-6 mr-2" />
                      Know How to &ldquo;Come Down&rdquo;
                    </h3>
                    <p className="text-gray-600 ml-8">
                      If effects feel too strong, remember: it&apos;s temporary and you&apos;ll be
                      fine. Try deep breathing, eating something, drinking water, or taking a nap.
                      Black pepper and CBD can also help reduce intensity. The effects will pass
                      with time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
