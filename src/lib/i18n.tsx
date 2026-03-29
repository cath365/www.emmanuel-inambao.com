'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'fr' | 'pt' | 'es' | 'de' | 'ar' | 'zh'

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'fr', 'pt', 'es', 'de', 'ar', 'zh']

export const RTL_LANGUAGES: Language[] = ['ar']

interface TranslationValues {
  en: string; fr: string; pt: string; es: string; de: string; ar: string; zh: string;
}

interface Translations {
  [key: string]: TranslationValues
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil', pt: 'Início', es: 'Inicio', de: 'Startseite', ar: 'الرئيسية', zh: '首页' },
  'nav.about': { en: 'About', fr: 'À propos', pt: 'Sobre', es: 'Sobre mí', de: 'Über mich', ar: 'عني', zh: '关于' },
  'nav.skills': { en: 'Skills', fr: 'Compétences', pt: 'Habilidades', es: 'Habilidades', de: 'Fähigkeiten', ar: 'المهارات', zh: '技能' },
  'nav.projects': { en: 'Projects', fr: 'Projets', pt: 'Projetos', es: 'Proyectos', de: 'Projekte', ar: 'المشاريع', zh: '项目' },
  'nav.experience': { en: 'Experience', fr: 'Expérience', pt: 'Experiência', es: 'Experiencia', de: 'Erfahrung', ar: 'الخبرة', zh: '经验' },
  'nav.contact': { en: 'Contact', fr: 'Contact', pt: 'Contato', es: 'Contacto', de: 'Kontakt', ar: 'اتصل بي', zh: '联系方式' },
  'nav.services': { en: 'Services', fr: 'Services', pt: 'Serviços', es: 'Servicios', de: 'Dienstleistungen', ar: 'الخدمات', zh: '服务' },
  'nav.blog': { en: 'Blog', fr: 'Blog', pt: 'Blog', es: 'Blog', de: 'Blog', ar: 'المدونة', zh: '博客' },
  'nav.caseStudies': { en: 'Case Studies', fr: 'Études de cas', pt: 'Estudos de Caso', es: 'Casos de Estudio', de: 'Fallstudien', ar: 'دراسات الحالة', zh: '案例研究' },
  'nav.gallery': { en: 'Gallery', fr: 'Galerie', pt: 'Galeria', es: 'Galería', de: 'Galerie', ar: 'معرض الصور', zh: '画廊' },
  'nav.education': { en: 'Education', fr: 'Formation', pt: 'Educação', es: 'Educación', de: 'Bildung', ar: 'التعليم', zh: '教育' },
  
  // Hero Section
  'hero.greeting': { en: "Hi, I'm", fr: 'Bonjour, je suis', pt: 'Olá, eu sou', es: 'Hola, soy', de: 'Hallo, ich bin', ar: 'مرحباً، أنا', zh: '你好，我是' },
  'hero.subtitle': { en: 'Electronic Engineer | IoT & Robotics Developer', fr: 'Ingénieur Électronique | Développeur IoT & Robotique', pt: 'Engenheiro Eletrônico | Desenvolvedor IoT & Robótica', es: 'Ingeniero Electrónico | Desarrollador IoT & Robótica', de: 'Elektroingenieur | IoT & Robotik-Entwickler', ar: 'مهندس إلكترونيات | مطور إنترنت الأشياء والروبوتات', zh: '电子工程师 | 物联网与机器人开发者' },
  'hero.cta.projects': { en: 'View Projects', fr: 'Voir les projets', pt: 'Ver Projetos', es: 'Ver Proyectos', de: 'Projekte ansehen', ar: 'عرض المشاريع', zh: '查看项目' },
  'hero.cta.contact': { en: 'Contact Me', fr: 'Me contacter', pt: 'Entre em Contato', es: 'Contáctame', de: 'Kontaktieren', ar: 'تواصل معي', zh: '联系我' },
  'hero.cta.cv': { en: 'Download CV', fr: 'Télécharger CV', pt: 'Baixar CV', es: 'Descargar CV', de: 'Lebenslauf herunterladen', ar: 'تحميل السيرة الذاتية', zh: '下载简历' },
  
  // About Section
  'about.title': { en: 'About Me', fr: 'À propos de moi', pt: 'Sobre Mim', es: 'Sobre Mí', de: 'Über mich', ar: 'عني', zh: '关于我' },
  'about.heading': { en: 'Engineering That Solves Problems', fr: 'Ingénierie qui résout les problèmes', pt: 'Engenharia que resolve problemas', es: 'Ingeniería que resuelve problemas', de: 'Technik, die Probleme löst', ar: 'هندسة تحل المشاكل', zh: '解决问题的工程' },
  'about.description': { en: 'I am a passionate engineer dedicated to building innovative solutions', fr: 'Je suis un ingénieur passionné dédié à la création de solutions innovantes', pt: 'Sou um engenheiro apaixonado dedicado a construir soluções inovadoras', es: 'Soy un ingeniero apasionado dedicado a crear soluciones innovadoras', de: 'Ich bin ein leidenschaftlicher Ingenieur, der innovative Lösungen entwickelt', ar: 'أنا مهندس شغوف مكرس لبناء حلول مبتكرة', zh: '我是一位充满激情的工程师，致力于构建创新解决方案' },
  
  // Skills Section
  'skills.title': { en: 'Skills & Technologies', fr: 'Compétences & Technologies', pt: 'Habilidades & Tecnologias', es: 'Habilidades y Tecnologías', de: 'Fähigkeiten & Technologien', ar: 'المهارات والتقنيات', zh: '技能与技术' },
  'skills.heading': { en: 'Skills & Technologies', fr: 'Compétences & Technologies', pt: 'Habilidades & Tecnologias', es: 'Habilidades & Tecnologías', de: 'Fähigkeiten & Technologien', ar: 'المهارات والتقنيات', zh: '技能与技术' },
  'skills.subtitle': { en: 'A comprehensive toolkit spanning hardware design, embedded firmware, IoT connectivity, and full-stack web development.', fr: 'Une boîte à outils complète couvrant la conception matérielle, le firmware embarqué, la connectivité IoT et le développement web full-stack.', pt: 'Um kit de ferramentas abrangente cobrindo design de hardware, firmware embarcado, conectividade IoT e desenvolvimento web full-stack.', es: 'Un conjunto completo de herramientas que abarca diseño de hardware, firmware embebido, conectividad IoT y desarrollo web full-stack.', de: 'Ein umfassendes Toolkit, das Hardware-Design, eingebettete Firmware, IoT-Konnektivität und Full-Stack-Webentwicklung umfasst.', ar: 'مجموعة أدوات شاملة تغطي تصميم الأجهزة والبرمجيات المضمنة واتصال إنترنت الأشياء وتطوير الويب الكامل.', zh: '涵盖硬件设计、嵌入式固件、物联网连接和全栈Web开发的综合工具包。' },
  
  // Projects Section
  'projects.title': { en: 'Featured Projects', fr: 'Projets en vedette', pt: 'Projetos em Destaque', es: 'Proyectos Destacados', de: 'Ausgewählte Projekte', ar: 'مشاريع مميزة', zh: '精选项目' },
  'projects.heading': { en: 'Featured Projects', fr: 'Projets en Vedette', pt: 'Projetos em Destaque', es: 'Proyectos Destacados', de: 'Ausgewählte Projekte', ar: 'مشاريع مميزة', zh: '精选项目' },
  'projects.subtitle': { en: 'Real-world engineering solutions that combine embedded hardware, IoT connectivity, and intuitive interfaces to solve tangible problems.', fr: 'Solutions d\'ingénierie réelles combinant matériel embarqué, connectivité IoT et interfaces intuitives pour résoudre des problèmes concrets.', pt: 'Soluções de engenharia do mundo real que combinam hardware embarcado, conectividade IoT e interfaces intuitivas para resolver problemas tangíveis.', es: 'Soluciones de ingeniería del mundo real que combinan hardware embebido, conectividad IoT e interfaces intuitivas para resolver problemas tangibles.', de: 'Reale Engineering-Lösungen, die eingebettete Hardware, IoT-Konnektivität und intuitive Schnittstellen kombinieren, um greifbare Probleme zu lösen.', ar: 'حلول هندسية واقعية تجمع بين الأجهزة المضمنة واتصال إنترنت الأشياء والواجهات البديهية لحل المشاكل الملموسة.', zh: '结合嵌入式硬件、物联网连接和直观界面来解决实际问题的真实工程解决方案。' },
  'projects.viewAll': { en: 'View All Projects', fr: 'Voir tous les projets', pt: 'Ver Todos os Projetos', es: 'Ver Todos los Proyectos', de: 'Alle Projekte ansehen', ar: 'عرض جميع المشاريع', zh: '查看所有项目' },
  'projects.viewProject': { en: 'View Project', fr: 'Voir le projet', pt: 'Ver Projeto', es: 'Ver Proyecto', de: 'Projekt ansehen', ar: 'عرض المشروع', zh: '查看项目' },
  'projects.viewCode': { en: 'View Code', fr: 'Voir le code', pt: 'Ver Código', es: 'Ver Código', de: 'Code ansehen', ar: 'عرض الكود', zh: '查看代码' },
  
  // Services Section
  'services.title': { en: 'Services', fr: 'Services', pt: 'Serviços', es: 'Servicios', de: 'Dienstleistungen', ar: 'الخدمات', zh: '服务' },
  'services.subtitle': { en: 'What I can do for you', fr: 'Ce que je peux faire pour vous', pt: 'O que posso fazer por você', es: 'Lo que puedo hacer por ti', de: 'Was ich für Sie tun kann', ar: 'ما يمكنني فعله لك', zh: '我能为您做什么' },
  
  // Contact Section
  'contact.title': { en: 'Get In Touch', fr: 'Contactez-moi', pt: 'Entre em Contato', es: 'Contáctame', de: 'Kontakt aufnehmen', ar: 'تواصل معي', zh: '联系我' },
  'contact.subtitle': { en: "Let's work together", fr: 'Travaillons ensemble', pt: 'Vamos trabalhar juntos', es: 'Trabajemos juntos', de: 'Lassen Sie uns zusammenarbeiten', ar: 'لنعمل معاً', zh: '让我们一起工作' },
  'contact.description': { en: "Have a project idea, need technical consultation, or want to discuss a partnership? I'm always open to new engineering challenges.", fr: "Vous avez une idée de projet, besoin d'une consultation technique ou vous souhaitez discuter d'un partenariat? Je suis toujours ouvert aux nouveaux défis.", pt: 'Tem uma ideia de projeto, precisa de consultoria técnica ou quer discutir uma parceria? Estou sempre aberto a novos desafios de engenharia.', es: '¿Tienes una idea de proyecto, necesitas consultoría técnica o quieres discutir una asociación? Siempre estoy abierto a nuevos desafíos de ingeniería.', de: 'Haben Sie eine Projektidee, brauchen Sie technische Beratung oder möchten Sie über eine Partnerschaft sprechen? Ich bin immer offen für neue technische Herausforderungen.', ar: 'هل لديك فكرة مشروع، تحتاج استشارة تقنية، أو تريد مناقشة شراكة؟ أنا دائماً منفتح على تحديات هندسية جديدة.', zh: '有项目想法、需要技术咨询或想讨论合作伙伴关系？我始终欢迎新的工程挑战。' },
  'contact.name': { en: 'Your Name', fr: 'Votre nom', pt: 'Seu Nome', es: 'Tu Nombre', de: 'Ihr Name', ar: 'اسمك', zh: '您的姓名' },
  'contact.email': { en: 'Your Email', fr: 'Votre email', pt: 'Seu Email', es: 'Tu Email', de: 'Ihre E-Mail', ar: 'بريدك الإلكتروني', zh: '您的邮箱' },
  'contact.message': { en: 'Your Message', fr: 'Votre message', pt: 'Sua Mensagem', es: 'Tu Mensaje', de: 'Ihre Nachricht', ar: 'رسالتك', zh: '您的留言' },
  'contact.send': { en: 'Send Message', fr: 'Envoyer le message', pt: 'Enviar Mensagem', es: 'Enviar Mensaje', de: 'Nachricht senden', ar: 'إرسال الرسالة', zh: '发送消息' },
  'contact.sending': { en: 'Sending...', fr: 'Envoi en cours...', pt: 'Enviando...', es: 'Enviando...', de: 'Wird gesendet...', ar: 'جاري الإرسال...', zh: '发送中...' },
  'contact.success': { en: 'Message sent successfully!', fr: 'Message envoyé avec succès!', pt: 'Mensagem enviada com sucesso!', es: '¡Mensaje enviado con éxito!', de: 'Nachricht erfolgreich gesendet!', ar: 'تم إرسال الرسالة بنجاح!', zh: '消息发送成功！' },
  'contact.error': { en: 'Failed to send message. Please try again.', fr: "Échec de l'envoi. Veuillez réessayer.", pt: 'Falha ao enviar. Por favor, tente novamente.', es: 'Error al enviar. Por favor, inténtalo de nuevo.', de: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.', ar: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.', zh: '发送失败，请重试。' },
  
  // Experience Section
  'experience.title': { en: 'Experience', fr: 'Expérience', pt: 'Experiência', es: 'Experiencia', de: 'Erfahrung', ar: 'الخبرة', zh: '工作经验' },
  'experience.subtitle': { en: 'My professional journey', fr: 'Mon parcours professionnel', pt: 'Minha jornada profissional', es: 'Mi trayectoria profesional', de: 'Mein beruflicher Werdegang', ar: 'مسيرتي المهنية', zh: '我的职业历程' },
  
  // Education Section
  'education.title': { en: 'Education', fr: 'Formation', pt: 'Educação', es: 'Educación', de: 'Bildung', ar: 'التعليم', zh: '教育背景' },
  'education.subtitle': { en: 'Academic background & certifications', fr: 'Formation académique et certifications', pt: 'Formação acadêmica e certificações', es: 'Formación académica y certificaciones', de: 'Akademischer Hintergrund und Zertifizierungen', ar: 'الخلفية الأكاديمية والشهادات', zh: '学历背景与认证' },
  
  // Gallery Section
  'gallery.title': { en: 'Gallery', fr: 'Galerie', pt: 'Galeria', es: 'Galería', de: 'Galerie', ar: 'معرض الصور', zh: '图库' },
  'gallery.subtitle': { en: 'Moments from my journey', fr: 'Moments de mon parcours', pt: 'Momentos da minha jornada', es: 'Momentos de mi trayectoria', de: 'Momente aus meiner Laufbahn', ar: 'لحظات من رحلتي', zh: '我的旅程瞬间' },
  'gallery.all': { en: 'All', fr: 'Tout', pt: 'Tudo', es: 'Todo', de: 'Alle', ar: 'الكل', zh: '全部' },
  'gallery.featured': { en: 'Featured', fr: 'En vedette', pt: 'Destaques', es: 'Destacados', de: 'Ausgewählt', ar: 'مميز', zh: '精选' },
  
  // Testimonials Section
  'testimonials.title': { en: 'Testimonials', fr: 'Témoignages', pt: 'Depoimentos', es: 'Testimonios', de: 'Referenzen', ar: 'الشهادات', zh: '客户评价' },
  'testimonials.subtitle': { en: 'What clients say about me', fr: 'Ce que les clients disent de moi', pt: 'O que os clientes dizem sobre mim', es: 'Lo que dicen mis clientes', de: 'Was Kunden über mich sagen', ar: 'ما يقوله العملاء عني', zh: '客户对我的评价' },
  
  // Footer
  'footer.rights': { en: 'All rights reserved', fr: 'Tous droits réservés', pt: 'Todos os direitos reservados', es: 'Todos los derechos reservados', de: 'Alle Rechte vorbehalten', ar: 'جميع الحقوق محفوظة', zh: '版权所有' },
  'footer.quickLinks': { en: 'Quick Links', fr: 'Liens Rapides', pt: 'Links Rápidos', es: 'Enlaces Rápidos', de: 'Schnelllinks', ar: 'روابط سريعة', zh: '快速链接' },
  'footer.built': { en: 'Built with ❤️ using Next.js', fr: 'Construit avec ❤️ en utilisant Next.js', pt: 'Construído com ❤️ usando Next.js', es: 'Hecho con ❤️ usando Next.js', de: 'Erstellt mit ❤️ mit Next.js', ar: 'مبني بـ ❤️ باستخدام Next.js', zh: '使用 Next.js 用 ❤️ 构建' },
  
  // Newsletter
  'newsletter.title': { en: 'Subscribe to Newsletter', fr: "S'abonner à la newsletter", pt: 'Assine a Newsletter', es: 'Suscríbete al boletín', de: 'Newsletter abonnieren', ar: 'اشترك في النشرة الإخبارية', zh: '订阅新闻通讯' },
  'newsletter.placeholder': { en: 'Enter your email', fr: 'Entrez votre email', pt: 'Digite seu email', es: 'Introduce tu email', de: 'E-Mail eingeben', ar: 'أدخل بريدك الإلكتروني', zh: '输入您的邮箱' },
  'newsletter.subscribe': { en: 'Subscribe', fr: "S'abonner", pt: 'Assinar', es: 'Suscribirse', de: 'Abonnieren', ar: 'اشتراك', zh: '订阅' },
  'newsletter.success': { en: 'Thanks for subscribing!', fr: 'Merci de votre abonnement!', pt: 'Obrigado por assinar!', es: '¡Gracias por suscribirte!', de: 'Danke für Ihr Abonnement!', ar: 'شكراً لاشتراكك!', zh: '感谢您的订阅！' },
  
  // Cookie Consent
  'cookie.title': { en: 'Cookie Consent', fr: 'Consentement aux cookies', pt: 'Consentimento de Cookies', es: 'Consentimiento de Cookies', de: 'Cookie-Einwilligung', ar: 'موافقة ملفات تعريف الارتباط', zh: 'Cookie 同意' },
  'cookie.message': { en: 'We use cookies to enhance your browsing experience and analyze site traffic.', fr: 'Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic du site.', pt: 'Usamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site.', es: 'Utilizamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio.', de: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern und den Website-Traffic zu analysieren.', ar: 'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح الخاصة بك وتحليل حركة المرور على الموقع.', zh: '我们使用 Cookie 来增强您的浏览体验并分析网站流量。' },
  'cookie.accept': { en: 'Accept All', fr: 'Tout accepter', pt: 'Aceitar Tudo', es: 'Aceptar Todo', de: 'Alle akzeptieren', ar: 'قبول الكل', zh: '全部接受' },
  'cookie.decline': { en: 'Decline', fr: 'Refuser', pt: 'Recusar', es: 'Rechazar', de: 'Ablehnen', ar: 'رفض', zh: '拒绝' },
  'cookie.settings': { en: 'Cookie Settings', fr: 'Paramètres des cookies', pt: 'Configurações de Cookies', es: 'Configuración de Cookies', de: 'Cookie-Einstellungen', ar: 'إعدادات ملفات تعريف الارتباط', zh: 'Cookie 设置' },
  'cookie.privacy': { en: 'Privacy Policy', fr: 'Politique de confidentialité', pt: 'Política de Privacidade', es: 'Política de Privacidad', de: 'Datenschutzrichtlinie', ar: 'سياسة الخصوصية', zh: '隐私政策' },
  
  // AI Chatbot
  'chatbot.title': { en: 'Chat with AI Assistant', fr: "Discuter avec l'assistant IA", pt: 'Conversar com Assistente IA', es: 'Chatear con Asistente IA', de: 'Mit KI-Assistent chatten', ar: 'الدردشة مع المساعد الذكي', zh: '与 AI 助手聊天' },
  'chatbot.placeholder': { en: 'Ask me anything about Emmanuel...', fr: 'Posez-moi des questions sur Emmanuel...', pt: 'Pergunte-me qualquer coisa sobre Emmanuel...', es: 'Pregúntame lo que quieras sobre Emmanuel...', de: 'Fragen Sie mich alles über Emmanuel...', ar: 'اسألني أي شيء عن إيمانويل...', zh: '问我任何关于 Emmanuel 的问题...' },
  'chatbot.welcome': { en: "Hi! I'm Emmanuel's AI assistant. How can I help you today?", fr: "Bonjour! Je suis l'assistant IA d'Emmanuel. Comment puis-je vous aider aujourd'hui?", pt: 'Olá! Sou o assistente IA do Emmanuel. Como posso ajudá-lo hoje?', es: '¡Hola! Soy el asistente IA de Emmanuel. ¿En qué puedo ayudarte hoy?', de: 'Hallo! Ich bin Emmanuels KI-Assistent. Wie kann ich Ihnen heute helfen?', ar: 'مرحباً! أنا مساعد إيمانويل الذكي. كيف يمكنني مساعدتك اليوم؟', zh: '你好！我是 Emmanuel 的 AI 助手。今天我能帮您什么？' },
  
  // Booking / Scheduler
  'booking.title': { en: 'Schedule a Meeting', fr: 'Planifier une réunion', pt: 'Agendar uma Reunião', es: 'Programar una Reunión', de: 'Termin vereinbaren', ar: 'حجز موعد', zh: '预约会议' },
  'booking.subtitle': { en: 'Select a time that works for you', fr: 'Sélectionnez un horaire qui vous convient', pt: 'Selecione um horário que funcione para você', es: 'Selecciona un horario que te convenga', de: 'Wählen Sie eine passende Zeit', ar: 'اختر وقتاً مناسباً لك', zh: '选择适合您的时间' },
  'booking.timezone': { en: 'Your timezone', fr: 'Votre fuseau horaire', pt: 'Seu fuso horário', es: 'Tu zona horaria', de: 'Ihre Zeitzone', ar: 'منطقتك الزمنية', zh: '您的时区' },
  'booking.confirm': { en: 'Confirm Booking', fr: 'Confirmer la réservation', pt: 'Confirmar Reserva', es: 'Confirmar Reserva', de: 'Buchung bestätigen', ar: 'تأكيد الحجز', zh: '确认预约' },
  'booking.duration': { en: 'Duration', fr: 'Durée', pt: 'Duração', es: 'Duración', de: 'Dauer', ar: 'المدة', zh: '时长' },
  'booking.minutes': { en: 'minutes', fr: 'minutes', pt: 'minutos', es: 'minutos', de: 'Minuten', ar: 'دقائق', zh: '分钟' },
  
  // Common
  'common.learnMore': { en: 'Learn More', fr: 'En savoir plus', pt: 'Saiba Mais', es: 'Más información', de: 'Mehr erfahren', ar: 'معرفة المزيد', zh: '了解更多' },
  'common.readMore': { en: 'Read More', fr: 'Lire la suite', pt: 'Leia Mais', es: 'Leer más', de: 'Mehr lesen', ar: 'اقرأ المزيد', zh: '阅读更多' },
  'common.loading': { en: 'Loading...', fr: 'Chargement...', pt: 'Carregando...', es: 'Cargando...', de: 'Lädt...', ar: 'جاري التحميل...', zh: '加载中...' },
  'common.close': { en: 'Close', fr: 'Fermer', pt: 'Fechar', es: 'Cerrar', de: 'Schließen', ar: 'إغلاق', zh: '关闭' },
  'common.save': { en: 'Save', fr: 'Enregistrer', pt: 'Salvar', es: 'Guardar', de: 'Speichern', ar: 'حفظ', zh: '保存' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler', pt: 'Cancelar', es: 'Cancelar', de: 'Abbrechen', ar: 'إلغاء', zh: '取消' },
  'common.delete': { en: 'Delete', fr: 'Supprimer', pt: 'Excluir', es: 'Eliminar', de: 'Löschen', ar: 'حذف', zh: '删除' },
  'common.edit': { en: 'Edit', fr: 'Modifier', pt: 'Editar', es: 'Editar', de: 'Bearbeiten', ar: 'تعديل', zh: '编辑' },
  'common.download': { en: 'Download', fr: 'Télécharger', pt: 'Baixar', es: 'Descargar', de: 'Herunterladen', ar: 'تحميل', zh: '下载' },
  'common.upload': { en: 'Upload', fr: 'Téléverser', pt: 'Enviar', es: 'Subir', de: 'Hochladen', ar: 'رفع', zh: '上传' },
  
  // Accessibility
  'a11y.skipToContent': { en: 'Skip to main content', fr: 'Passer au contenu principal', pt: 'Pular para o conteúdo principal', es: 'Saltar al contenido principal', de: 'Zum Hauptinhalt springen', ar: 'تخطي إلى المحتوى الرئيسي', zh: '跳转到主要内容' },
  'a11y.toggleDarkMode': { en: 'Toggle dark mode', fr: 'Basculer le mode sombre', pt: 'Alternar modo escuro', es: 'Alternar modo oscuro', de: 'Dunkelmodus umschalten', ar: 'تبديل الوضع الداكن', zh: '切换深色模式' },
  'a11y.openMenu': { en: 'Open menu', fr: 'Ouvrir le menu', pt: 'Abrir menu', es: 'Abrir menú', de: 'Menü öffnen', ar: 'فتح القائمة', zh: '打开菜单' },
  'a11y.closeMenu': { en: 'Close menu', fr: 'Fermer le menu', pt: 'Fechar menu', es: 'Cerrar menú', de: 'Menü schließen', ar: 'إغلاق القائمة', zh: '关闭菜单' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Auto-detect language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      setLanguage(savedLang)
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.split('-')[0] as Language
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  // Save language preference and update document direction
  useEffect(() => {
    localStorage.setItem('language', language)
    // Update document direction for RTL languages
    const isRTL = RTL_LANGUAGES.includes(language)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const isRTL = RTL_LANGUAGES.includes(language)
  const dir = isRTL ? 'rtl' : 'ltr'

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default values if outside provider (SSR)
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => translations[key]?.en || key,
      isRTL: false,
      dir: 'ltr' as const,
    }
  }
  return context
}

// Language Switcher Component with 7 languages
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ]

  const currentLang = languages.find((l) => l.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute end-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4 ms-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Export translations for server-side use
export function getTranslation(key: string, lang: Language = 'en'): string {
  return translations[key]?.[lang] || translations[key]?.en || key
}

// Get all translations for a language (useful for SSR)
export function getAllTranslations(lang: Language = 'en'): Record<string, string> {
  const result: Record<string, string> = {}
  Object.keys(translations).forEach(key => {
    result[key] = translations[key]?.[lang] || translations[key]?.en || key
  })
  return result
}
