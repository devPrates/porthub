// Seed inicial do banco (dev)
// Usa Prisma Client e bcryptjs para criar dados reais sem migrações.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: passwordHash,
      role: "ADMIN",
      bio: "Administrador inicial",
    },
  });

  const portfolio = await prisma.portfolio.upsert({
    where: { user_id: user.id },
    update: {},
    create: {
      user_id: user.id,
      title: "Meu Portfólio",
      subtitle: "Dev Full-Stack",
    },
  });

  const hero = await prisma.hero.upsert({
    where: { portfolio_id: portfolio.id },
    update: {},
    create: {
      portfolio_id: portfolio.id,
      name: "Seu Nome",
      description: "Desenvolvedor apaixonado por soluções escaláveis.",
    },
  });

  const about = await prisma.about.upsert({
    where: { portfolio_id: portfolio.id },
    update: {},
    create: {
      portfolio_id: portfolio.id,
      title: "Sobre mim",
      subtitle: "Tecnologias e experiência",
      description: "Construo produtos com foco em qualidade e manutenção.",
    },
  });

  const tsTech = await prisma.technology.upsert({
    where: { slug: "typescript" },
    update: {},
    create: { name: "TypeScript", slug: "typescript" },
  });

  // Associações de tecnologia
  await prisma.heroTech.upsert({
    where: { hero_id_technology_id: { hero_id: hero.id, technology_id: tsTech.id } },
    update: {},
    create: { hero_id: hero.id, technology_id: tsTech.id },
  });
  await prisma.aboutTech.upsert({
    where: { about_id_technology_id: { about_id: about.id, technology_id: tsTech.id } },
    update: {},
    create: { about_id: about.id, technology_id: tsTech.id },
  });

  const project = await prisma.project.upsert({
    where: { portfolio_id_slug: { portfolio_id: portfolio.id, slug: "primeiro-projeto" } },
    update: {},
    create: {
      portfolio_id: portfolio.id,
      slug: "primeiro-projeto",
      title: "Primeiro Projeto",
      description: "Projeto exemplo com TypeScript",
    },
  });

  await prisma.projectTech.upsert({
    where: { project_id_technology_id: { project_id: project.id, technology_id: tsTech.id } },
    update: {},
    create: { project_id: project.id, technology_id: tsTech.id },
  });

  const experience = await prisma.experience.create({
    data: {
      portfolio_id: portfolio.id,
      title: "Empresa X",
      subtitle: "Desenvolvedor",
      description: "Atuação em projetos web.",
    },
  });

  const company = await prisma.company.create({
    data: {
      experience_id: experience.id,
      name: "Empresa X",
      role_name: "Software Engineer",
      description: "Produtos escaláveis e seguros.",
      date_start: new Date(),
    },
  });

  await prisma.companyTech.upsert({
    where: { company_id_technology_id: { company_id: company.id, technology_id: tsTech.id } },
    update: {},
    create: { company_id: company.id, technology_id: tsTech.id },
  });

  await prisma.certificate.upsert({
    where: { experience_id_slug: { experience_id: experience.id, slug: "certificado-ts" } },
    update: {},
    create: {
      experience_id: experience.id,
      slug: "certificado-ts",
      name: "Certificado TypeScript",
      type: "CURSO",
      hours: 8,
    },
  });

  await prisma.socialLink.create({
    data: { portfolio_id: portfolio.id, name: "GitHub", url: "https://github.com/seuuser" },
  });

  await prisma.page.upsert({
    where: { portfolio_id_slug: { portfolio_id: portfolio.id, slug: "sobre" } },
    update: {},
    create: {
      portfolio_id: portfolio.id,
      slug: "sobre",
      title: "Página Sobre",
      content: { blocks: [] },
      published: true,
    },
  });

  const blog = await prisma.blog.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id, title: "Meu Blog", subtitle: "Notas e tutoriais" },
  });

  const category = await prisma.category.upsert({
    where: { blog_id_slug: { blog_id: blog.id, slug: "typescript" } },
    update: {},
    create: { blog_id: blog.id, name: "TypeScript", slug: "typescript" },
  });

  await prisma.post.upsert({
    where: { blog_id_slug: { blog_id: blog.id, slug: "bem-vindo" } },
    update: {},
    create: {
      blog_id: blog.id,
      category_id: category.id,
      slug: "bem-vindo",
      title: "Bem-vindo ao blog",
      description: "Primeiro post",
      content: { blocks: [] },
      published: true,
    },
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });