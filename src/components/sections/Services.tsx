'use client'

import { motion } from 'framer-motion'
import { 
  Cpu, Code, Smartphone, Globe, Settings, Zap, 
  Database, Cloud, Shield, Wifi, Monitor, Wrench,
  CheckCircle2, LucideIcon
} from 'lucide-react'
import { useServices } from '@/lib/services'
import { useLanguage } from '@/lib/i18n'
import Image from 'next/image'

const iconMap: Record<string, LucideIcon> = {
  'cpu': Cpu,
  'code': Code,
  'smartphone': Smartphone,
  'globe': Globe,
  'settings': Settings,
  'zap': Zap,
  'database': Database,
  'cloud': Cloud,
  'shield': Shield,
  'wifi': Wifi,
  'monitor': Monitor,
  'wrench': Wrench,
}

export default function Services() {
  const { services } = useServices()
  const { t } = useLanguage()

  if (services.length === 0) {
    return null
  }

  const featuredServices = services.filter(s => s.featured)
  const otherServices = services.filter(s => !s.featured)

  return (
    <section id="services" className="py-20 bg-dark-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('services.title')}
          </h2>
          <p className="text-dark-300 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Settings
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300"
                >
                  {service.image && (
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="relative p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/30 transition-colors">
                        <IconComponent className="w-8 h-8 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {service.title}
                          </h3>
                          {service.price && (
                            <span className="text-primary-400 font-semibold">
                              {service.price}
                            </span>
                          )}
                        </div>
                        <p className="text-dark-300 mb-4">{service.description}</p>
                        
                        {service.features.length > 0 && (
                          <ul className="space-y-2">
                            {service.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-dark-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Other Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featuredServices.length > 0 ? otherServices : services).map((service, index) => {
            const IconComponent = iconMap[service.icon] || Settings
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-dark-800/50 border border-dark-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center mb-4 group-hover:bg-primary-600/30 transition-colors">
                  <IconComponent className="w-6 h-6 text-primary-500" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {service.title}
                  </h3>
                  {service.price && (
                    <span className="text-primary-400 text-sm font-medium">
                      {service.price}
                    </span>
                  )}
                </div>
                
                <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {service.features.length > 0 && (
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-dark-500 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-primary-500/70 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-dark-500 text-xs pl-5">
                        +{service.features.length - 3} more
                      </li>
                    )}
                  </ul>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
