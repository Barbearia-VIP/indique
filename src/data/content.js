// Links usados nos CTAs. Troque `app` pelo link da App Store / Google Play
// (ou por uma página de download) quando estiver disponível.
export const links = {
  app: 'https://barbeariavip.com.br',
  site: 'https://barbeariavip.com.br',
}

// Percentual do valor gasto pelo amigo que volta em créditos
export const CREDIT_RATE = 0.3

export const navLinks = [
  { label: 'Vantagens', href: '#vantagens' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Simule', href: '#simulador' },
  { label: 'Dúvidas', href: '#duvidas' },
]

export const marqueeItems = [
  'Indicou.',
  'Ele veio.',
  'Você ganhou.',
  'Mais amigos.',
  'Mais créditos.',
  'Mais VIP.',
]

export const chapters = [
  {
    num: '01',
    title: ['Seu amigo curte a VIP.', 'Você acumula créditos.'],
    p1: 'A funcionalidade “Indique um amigo”, disponível no app Barbearia VIP, transforma recomendações em benefícios dentro da própria experiência VIP.',
    p2: 'Indique pelo app e seu próximo corte pode sair grátis.',
    img: 'img/foto-amigos.jpg',
    alt: 'Cliente e barbeiro da Barbearia VIP conversando e sorrindo',
    align: 'left',
  },
  {
    num: '02',
    title: ['Indicou. Ele veio.', 'Você ganhou.'],
    p1: '30% do valor gasto pelo seu amigo volta para você em créditos no app.',
    p2: 'Os créditos são cumulativos: acumule e use nos seus próximos serviços da Barbearia VIP.',
    img: 'img/foto-indicou.jpg',
    alt: 'Cliente sorridente na cadeira ao lado do barbeiro da Barbearia VIP',
    align: 'right',
  },
]

export const steps = [
  {
    title: 'Indique',
    tagline: 'Tudo começa no app',
    desc: 'Abra o app Barbearia VIP e toque em “Indique um amigo”. Informe o nome e o telefone de alguém que ainda não é cliente VIP.',
    img: 'img/app-passo-1.jpg',
    alt: 'Tela inicial do app Barbearia VIP com a opção Indique um amigo em destaque',
  },
  {
    title: 'Compartilhe',
    tagline: 'Um convite só seu',
    desc: 'O app gera um convite personalizado. Envie o link diretamente para o seu amigo.',
    img: 'img/app-passo-2.jpg',
    alt: 'Tela Indicar amigo com os campos nome completo e telefone',
  },
  {
    title: 'Ele vem para a VIP',
    tagline: 'Cadastro + atendimento',
    desc: 'Seu amigo se cadastra pelo convite e realiza um atendimento na Barbearia VIP.',
    img: 'img/app-passo-3.jpg',
    alt: 'Tela Indicação criada com o botão Compartilhar convite',
  },
  {
    title: 'Você ganha',
    tagline: '30% em créditos',
    desc: 'Você recebe em créditos no app o equivalente a 30% do valor gasto pelo seu amigo.',
    img: 'img/app-passo-4.jpg',
    alt: 'Tela Faça seu cadastro que o amigo indicado preenche',
  },
  {
    title: 'Acumule e use',
    tagline: 'Seu próximo corte pode sair grátis',
    desc: 'Os créditos são cumulativos e podem ser usados nos seus próximos serviços da Barbearia VIP.',
    img: 'img/app-passo-5.jpg',
    alt: 'Tela Indicação convertida: você recebeu 30% do valor gasto pelo seu amigo em créditos',
  },
]

export const faqs = [
  {
    q: 'Quem eu posso indicar?',
    a: 'Qualquer pessoa que ainda não seja cliente da Barbearia VIP. A indicação é feita pelo app, com o nome e o telefone do seu amigo.',
  },
  {
    q: 'Como faço uma indicação?',
    a: 'Abra o app Barbearia VIP, toque em “Indique um amigo” e informe o nome e o telefone da pessoa. O app gera um convite personalizado para você enviar direto para ela.',
  },
  {
    q: 'Quando eu ganho os créditos?',
    a: 'Quando o seu amigo se cadastra pelo convite e realiza um atendimento na Barbearia VIP. A indicação aparece como convertida no seu app.',
  },
  {
    q: 'Quanto eu recebo por indicação?',
    a: 'O equivalente a 30% do valor gasto pelo seu amigo no atendimento, creditado no seu app.',
  },
  {
    q: 'Os créditos acumulam?',
    a: 'Sim. Os créditos são cumulativos: quanto mais amigos virarem clientes VIP, mais créditos você junta.',
  },
  {
    q: 'Onde eu uso os créditos?',
    a: 'Nos serviços da Barbearia VIP. Acumule e use nos seus próximos atendimentos — seu próximo corte pode sair grátis.',
  },
  {
    q: 'Como acompanho minhas indicações?',
    a: 'Pelo próprio app: em “Indique um amigo” você compartilha o convite e acompanha as suas indicações.',
  },
]
