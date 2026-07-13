import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '3 solid #7042f8',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#7042f8',
    marginBottom: 5,
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Helvetica-Bold',
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1 solid #e0e0e0',
  },
  contactItem: {
    fontSize: 9,
    color: '#333',
    marginBottom: 3,
  },
  link: {
    color: '#7042f8',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#7042f8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '2 solid #b49bff',
    paddingBottom: 3,
  },
  text: {
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  bullet: {
    fontSize: 10,
    color: '#333',
    lineHeight: 1.6,
    marginBottom: 4,
    paddingLeft: 15,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#f0ebff',
    padding: '5 10',
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
  },
  skillText: {
    fontSize: 9,
    color: '#7042f8',
    fontFamily: 'Helvetica-Bold',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  experienceTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  experienceDate: {
    fontSize: 9,
    color: '#666',
    fontFamily: 'Helvetica-Oblique',
  },
  experienceSubtitle: {
    fontSize: 10,
    color: '#7042f8',
    marginBottom: 5,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  university: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  gpa: {
    fontSize: 9,
    color: '#7042f8',
    fontFamily: 'Helvetica-Bold',
  },
});

// Función que retorna el elemento React del CV
const createCVDocument = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>JULIÁN ESTIVEN GUTIÉRREZ TABARES</Text>
        <Text style={styles.title}>Tecnólogo en Desarrollo de Software</Text>
      </View>

      {/* Contacto */}
      <View style={styles.contactSection}>
        <View>
          <Text style={styles.contactItem}>Email: julian.estiven.gutierrez@correounivalle.edu.co</Text>
          <Text style={styles.contactItem}>Tel: +57 323 437 8971</Text>
        </View>
        <View>
          <Text style={styles.contactItem}>
            GitHub: <Link src="https://github.com/Karatsuyu" style={styles.link}>github.com/Karatsuyu</Link>
          </Text>
          <Text style={styles.contactItem}>
            LinkedIn: <Link src="https://linkedin.com/in/julian-gutierrez" style={styles.link}>LinkedIn</Link>
          </Text>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Lenguajes:</Text>
          <View style={styles.skillsGrid}>
            <View style={styles.skillChip}><Text style={styles.skillText}>TypeScript</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>JavaScript</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Python</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Java</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>SQL</Text></View>
          </View>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Frameworks & Librerías:</Text>
          <View style={styles.skillsGrid}>
            <View style={styles.skillChip}><Text style={styles.skillText}>React</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Next.js</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Node.js</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Django</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>FastAPI</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Express</Text></View>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Herramientas & DevOps:</Text>
          <View style={styles.skillsGrid}>
            <View style={styles.skillChip}><Text style={styles.skillText}>Docker</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>Git</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>PostgreSQL</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>MongoDB</Text></View>
            <View style={styles.skillChip}><Text style={styles.skillText}>AWS</Text></View>
          </View>
        </View>
      </View>

      {/* Educación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Educación</Text>
        <View style={styles.educationItem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={styles.degree}>Tecnología en Desarrollo de Software</Text>
            <Text style={styles.experienceDate}>2022 - 2024</Text>
          </View>
          <Text style={styles.university}>Universidad del Valle, Cali, Colombia</Text>
          <Text style={styles.gpa}>GPA: 4.2/5.0</Text>
        </View>
      </View>

      {/* Proyectos Destacados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proyectos Destacados</Text>
        
        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>MiSalud - Plataforma de Salud Digital</Text>
            <Text style={styles.experienceDate}>Sep - Dic 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer | Proyecto Capstone</Text>
          <Text style={styles.bullet}>• Desarrollé app de salud con seguimiento de signos vitales, citas médicas y expediente clínico</Text>
          <Text style={styles.bullet}>• Implementé Django REST con OAuth2 + 2FA y frontend React como PWA offline</Text>
          <Text style={styles.bullet}>• Integré gráficas en tiempo real con WebSocket y cifrado AES-256 para datos sensibles</Text>
          <Text style={styles.bullet}>• Premio Mejor Proyecto Capstone 2024 - Calificación: 5.0/5.0</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Sistema Registral - Gestión Documental</Text>
            <Text style={styles.experienceDate}>Jun - Dic 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Backend Developer | Práctica Profesional</Text>
          <Text style={styles.bullet}>• API REST Express + PostgreSQL con 50+ endpoints y sistema RBAC granular</Text>
          <Text style={styles.bullet}>• Flujo de aprobación multinivel con notificaciones en tiempo real</Text>
          <Text style={styles.bullet}>• Reducción del 60% en tiempo de procesamiento documental</Text>
          <Text style={styles.bullet}>• Sistema en producción procesando 500+ documentos diarios</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Delicious Food - Plataforma de Pedidos Online</Text>
            <Text style={styles.experienceDate}>Jul - Sep 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer | Freelance</Text>
          <Text style={styles.bullet}>• SPA React 19 + Vite con carrito persistente y backend Django 5 + DRF</Text>
          <Text style={styles.bullet}>• Integración completa con Stripe: checkout, webhooks y reembolsos</Text>
          <Text style={styles.bullet}>• Dashboard analítico para propietario con métricas de ventas</Text>
          <Text style={styles.bullet}>• Aumento del 35% en pedidos online en 30 días</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>ParkingPro SaaS - Gestión de Parqueaderos</Text>
            <Text style={styles.experienceDate}>Mar - Jun 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer | Práctica Profesional</Text>
          <Text style={styles.bullet}>• SaaS multi-tenant con Node.js + PostgreSQL 15 y WebSockets Socket.IO</Text>
          <Text style={styles.bullet}>• Soporte para 200+ conexiones simultáneas con métricas en tiempo real</Text>
          <Text style={styles.bullet}>• Dashboard React + Recharts con metodología Scrum (6 sprints)</Text>
          <Text style={styles.bullet}>• Calificación: 4.8/5.0 - Caso de estudio en Arquitectura de Software</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Tienda Online - E-commerce Full-Stack</Text>
            <Text style={styles.experienceDate}>Feb - Abr 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer & DevOps | Freelance</Text>
          <Text style={styles.bullet}>• Next.js 15 con SSR/ISR + API FastAPI asíncrona con SQLAlchemy 2</Text>
          <Text style={styles.bullet}>• Integración Stripe Checkout con webhooks idempotentes</Text>
          <Text style={styles.bullet}>• Deploy con Docker Compose + Nginx en VPS propio</Text>
          <Text style={styles.bullet}>• Cliente activo: 200+ productos, 50+ ventas mensuales</Text>
        </View>
      </View>

    </Page>

    {/* Página 2 */}
    <Page size="A4" style={styles.page}>
      
      {/* Más Proyectos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proyectos Adicionales</Text>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Portfolio Web Multi-Estilo</Text>
            <Text style={styles.experienceDate}>Ene - Feb 2024</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Frontend Developer & Designer | Personal</Text>
          <Text style={styles.bullet}>• 4 sistemas de diseño completamente independientes (Space, Classic, Runic, Cyber)</Text>
          <Text style={styles.bullet}>• Next.js 13 App Router con animaciones Three.js y Framer Motion</Text>
          <Text style={styles.bullet}>• Score Lighthouse 94/100 en performance</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Lavadero App - Gestión Full Stack</Text>
            <Text style={styles.experienceDate}>Jul - Nov 2023</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer | Proyecto Académico</Text>
          <Text style={styles.bullet}>• API REST Django + DRF con autenticación JWT</Text>
          <Text style={styles.bullet}>• Cliente Tkinter consumiendo API en tiempo real</Text>
          <Text style={styles.bullet}>• Sistema en uso en negocio real durante 3 meses</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Sistema Bancario - POO Avanzado</Text>
            <Text style={styles.experienceDate}>Mar - Jun 2023</Text>
          </View>
          <Text style={styles.experienceSubtitle}>Full Stack Developer | Proyecto Académico</Text>
          <Text style={styles.bullet}>• Arquitectura POO con herencia múltiple y polimorfismo</Text>
          <Text style={styles.bullet}>• Interfaz Tkinter con 12 pantallas de navegación</Text>
          <Text style={styles.bullet}>• Tests unitarios con 85% de cobertura - Calificación: 4.9/5.0</Text>
        </View>
      </View>

      {/* Experiencia Práctica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiencia Práctica</Text>
        
        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Práctica Profesional - Desarrollo Backend</Text>
            <Text style={styles.experienceDate}>Jun - Dic 2024</Text>
          </View>
          <Text style={styles.university}>Entidad Registral, Colombia</Text>
          <Text style={styles.bullet}>• Desarrollé módulo de gestión documental con flujos de aprobación multinivel</Text>
          <Text style={styles.bullet}>• Implementé sistema RBAC con roles y permisos granulares</Text>
          <Text style={styles.bullet}>• Reducción del 60% en tiempo de procesamiento documental</Text>
        </View>

        <View style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>Práctica Profesional - Desarrollo Full Stack</Text>
            <Text style={styles.experienceDate}>Mar - Jun 2024</Text>
          </View>
          <Text style={styles.university}>ParkingPro SaaS, Colombia</Text>
          <Text style={styles.bullet}>• Arquitectura multi-tenant con tiempo real usando WebSockets</Text>
          <Text style={styles.bullet}>• Dashboard analítico con métricas en tiempo real</Text>
          <Text style={styles.bullet}>• Metodología ágil Scrum con 6 sprints de 2 semanas</Text>
        </View>
      </View>

      {/* Certificaciones y Logros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificaciones & Logros</Text>
        <Text style={styles.bullet}>• Premio Mejor Proyecto Capstone 2024 - Universidad del Valle</Text>
        <Text style={styles.bullet}>• Tecnólogo en Desarrollo de Software (4.2/5.0)</Text>
        <Text style={styles.bullet}>• Portfolio con 8 proyectos full-stack en producción</Text>
        <Text style={styles.bullet}>• Score Lighthouse 94/100 en proyectos web</Text>
      </View>

      {/* Idiomas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idiomas</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>Español</Text>
            <Text style={{ fontSize: 9, color: '#666' }}>Nativo</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>Inglés</Text>
            <Text style={{ fontSize: 9, color: '#666' }}>Intermedio (B1)</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: '1 solid #e0e0e0', paddingTop: 10 }}>
        <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>
          Disponible para oportunidades de desarrollo Full Stack • Portfolio: julianportfolio.com
        </Text>
      </View>

      </Page>
    </Document>
  );
};

export default createCVDocument;
