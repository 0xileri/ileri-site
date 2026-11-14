import avatar from './assets/img/avatar-x-400.webp'
import avatarSm from './assets/img/avatar-x-96.webp'
import banner from './assets/img/banner-x-1200.webp'
import bannerSm from './assets/img/banner-x-640.webp'
import thumbShowreel from './assets/img/showreel-thumb.webp'
import thumbKai from './assets/img/kai-thumb.webp'
import thumbBanger from './assets/img/banger-thumb.webp'
import logoOkx from './assets/logos/okx.webp'
import logoLaunchMyNFT from './assets/logos/launchmynft.webp'
import logoBungee from './assets/logos/bungeeexchange.webp'
import logoPerle from './assets/logos/perlelabs.webp'
import logoEuclid from './assets/logos/euclidprotocol.webp'
import logoHiggsfield from './assets/logos/higgsfield_ai.webp'
import logoKite from './assets/logos/gokiteai.webp'
import logoWiener from './assets/logos/wienerlabs.webp'
import logoAltura from './assets/logos/altura.webp'

export const X_URL = 'https://x.com/0xileri'
export const AVATAR = avatar
export const AVATAR_SM = avatarSm // 96px, for the 40px post avatars
export const BANNER = banner // current @0xileri X banner, 1200w webp
export const BANNER_SM = bannerSm
export const DM_URL = 'https://x.com/messages/compose?recipient_id=1277669087158718467'
export const TG_URL = 'https://t.me/oxileri'
export const AI_VIDEO_URL = 'https://x.com/0xileri/status/2088141897906680180'

const post = (id) => `https://x.com/0xileri/status/${id}`

// Real numbers only. Followers checked on X on Nov 14, 2026 (10,683).
export const stats = [
  { value: '10.6K+', label: 'followers on X' },
  { value: '30+', label: 'web3 projects worked with' },
  { value: '20+', label: 'ecosystems with bounty wins' },
  { value: '$3,000', label: 'OKX hackathon win' },
]

export const ecosystems = [
  'OKX', 'LaunchMyNFT', 'Bungee', 'PerleLabs', 'Melee Market', 'Dzap', 'Altura',
  'Euclid', 'Yetch', 'Higgsfield', 'Triad', 'WienerLabs', 'Beaks', 'Unipix', '365',
]

export const services = [
  {
    n: '01',
    title: 'Content and exposure',
    body: 'Posts and quote posts about your project on my page, written in my own voice for a crowd that already follows AI and crypto. I also engage with your posts every day so they keep getting pushed.',
    tags: ['Posts', 'Quote posts', 'Daily engagement'],
  },
  {
    n: '02',
    title: 'KOL campaigns',
    body: 'I manage a group of creators. I pick the ones that fit your project, brief them, keep the posts on schedule and send you every link after.',
    tags: ['Creator picks', 'Briefs', 'Tracking'],
  },
  {
    n: '03',
    title: 'Community setup and growth',
    body: 'Discord or Telegram set up properly with channels, roles and a welcome flow. Then quests, giveaways and engagement drives to bring people in and keep them around.',
    tags: ['Discord', 'Telegram', 'Quests and giveaways'],
  },
  {
    n: '04',
    title: 'AI video',
    body: 'Launch videos, trailers and explainers made with AI. Quick to turn around and easy to share on the timeline.',
    tags: ['Launch videos', 'Trailers', 'Explainers'],
    link: { label: 'See recent AI video work', href: AI_VIDEO_URL },
  },
]

export const packages = [
  {
    name: 'Starter',
    items: [
      '4 posts on my page',
      '4 quote posts',
      'Daily engagement with your posts',
      'Basic community setup (Discord or Telegram structure, roles, welcome flow)',
    ],
  },
  {
    name: 'Growth',
    featured: true,
    items: [
      '8 posts + 8 quotes',
      'KOL push with 5 creators from my network',
      'Community growth campaigns (quests, giveaways, engagement drives)',
      'Weekly report',
    ],
  },
  {
    name: 'Launch',
    items: [
      'Everything in Growth',
      'Bigger KOL campaign with 10-15 creators',
      'A 1-minute AI launch video or trailer',
      'Launch week planning and coordination',
    ],
  },
]

export const oneOff = [
  { item: 'Post on my page' },
  { item: 'Quote post' },
  { item: '1-minute AI video' },
  { item: 'KOL campaign' },
]

export const steps = [
  { n: '01', title: 'Pitch', body: 'You DM me, or I reach out first. We talk about what you are building and where you want to get to.' },
  { n: '02', title: 'Plan', body: 'I put together the posts, creators, community steps and video you need, with dates attached.' },
  { n: '03', title: 'Launch', body: 'We go live. I run the plan, share links as things post, and send a report so you can see what worked.' },
]

export const featured = [
  { name: 'LaunchMyNFT', badge: '1st place', kicker: 'Creator campaign', body: 'First place in the LaunchMyNFT creator campaign.', href: post('2049553153738117425') },
  { name: 'Bungee', badge: '1st place', kicker: 'Community campaign', body: 'Top community submission across the whole Bungee campaign.', href: post('2035001439517335798') },
  { name: 'PerleLabs', badge: 'Top 5', kicker: '10,000+ submissions', body: 'Ranked top 5 on a leaderboard with more than 10,000 submissions.', href: post('2037235146655478071') },
]

export const builds = [
  {
    name: 'LEAPSY',
    tag: '$3,000 OKX hackathon win',
    body: 'An options strategy agent for long-horizon crypto investors, using real listed Deribit contracts. Listed on OKX.AI.',
    href: post('2085564399511638201'),
    cta: 'Win post on X',
  },
  {
    name: 'SpactVault',
    tag: 'Live on NEAR mainnet',
    body: 'Spending limits for AI agents. Small payments go through, bigger ones wait for the owner to approve, and anything over the limit gets refused on chain.',
    href: 'https://github.com/0xileri/SpactVault',
    cta: 'Code on GitHub',
  },
  {
    name: 'Hunch',
    tag: 'Orbio Build Week',
    body: 'An agent with its own inference budget. It watches public sources for free and only pays for research when a narrative looks worth it.',
    href: 'https://github.com/0xileri/hunch',
    cta: 'Code on GitHub',
  },
  {
    name: 'Rung',
    tag: 'Stocklana hackathon',
    body: 'A capital-backed valuation market for PreStocks on Solana.',
    href: 'https://github.com/0xileri/rung',
    cta: 'Code on GitHub',
  },
]

export const wins = [
  { name: 'OKX (LEAPSY)', result: '$3,000 hackathon win', type: 'Hackathon', href: post('2085564399511638201') },
  { name: 'LaunchMyNFT', result: '1st place', type: 'Win', href: post('2049553153738117425') },
  { name: 'Bungee', result: '1st place', type: 'Win', href: post('2035001439517335798') },
  { name: 'PerleLabs', result: 'Top 5 of 10,000+', type: 'Placement', href: post('2037235146655478071') },
  { name: 'Melee Market', result: 'Winner', type: 'Win', href: post('2053754076479770751') },
  { name: 'Dzap', result: 'Winner', type: 'Win', href: post('2041162404545843711') },
  { name: 'Altura', result: 'Winner', type: 'Win', href: post('2025497795415662709') },
  { name: 'Euclid', result: 'Winner', type: 'Win', href: post('2032896106808414325') },
  { name: 'Yetch', result: '2nd place', type: 'Placement', href: post('2033976307210481759') },
  { name: 'Beaks NFT', result: 'NFT spot', type: 'NFT spot', href: post('2052951163050377622') },
  { name: 'Unipix NFT', result: 'NFT spot', type: 'NFT spot', href: post('2054063310794788879') },
  { name: '365 NFT', result: 'NFT spot', type: 'NFT spot', href: post('2050268007709241640') },
]

export const receipts = [
  { name: 'LaunchMyNFT', label: '1st place', href: post('2049553153738117425') },
  { name: 'Bungee', label: '1st place', href: post('2035001439517335798') },
  { name: 'Melee Market', label: 'Winner', href: post('2053754076479770751') },
  { name: 'PerleLabs', label: 'Top 5 leaderboard', href: post('2037235146655478071') },
  { name: 'Yetch', label: '2nd place', href: post('2033976307210481759') },
  { name: 'Euclid', label: 'Winner', href: post('2032896106808414325') },
  { name: 'Altura', label: 'Winner', href: post('2025497795415662709') },
]

export const roles = [
  { name: 'Higgsfield', role: 'Creator' },
  { name: 'Triad', role: 'Contributor' },
  { name: 'Kite AI', role: 'Affiliate' },
]

export const contacts = [
  { label: 'X (DMs open)', value: '@0xileri', href: DM_URL, primary: true },
  { label: 'Telegram', value: '@oxileri', href: TG_URL },
  { label: 'Email', value: 'bapkingboss2@gmail.com', href: 'mailto:bapkingboss2@gmail.com' },
  { label: 'TikTok', value: '@0xileri', href: 'https://www.tiktok.com/@0xileri' },
  { label: 'Instagram', value: '@0xileri', href: 'https://www.instagram.com/0xileri' },
]

// Profile header. Counts checked on X on Nov 14, 2026 (10,683 followers, 2,494 following).
export const profile = {
  name: 'ileri 𖣂',
  handle: '@0xileri',
  bio: 'Growth for early AI and crypto projects. Posts on my page, KOL campaigns, community setup and AI video. Builder with a $3,000 OKX hackathon win.',
  site: 'ileri.lol',
  followers: '10.6K+',
  following: '2.4K',
}

export const whoToFollow = [
  { name: 'ileri 𖣂', handle: '@0xileri', href: X_URL, avatar: avatarSm, cta: 'Follow' },
  { name: 'SpactVault', handle: '@spactvault', href: 'https://x.com/spactvault', letter: 'S', cta: 'Follow' },
  { name: 'ileri on GitHub', handle: 'github.com/0xileri', href: 'https://github.com/0xileri', letter: 'G', cta: 'View' },
  { name: 'ileri on Telegram', handle: 't.me/oxileri', href: TG_URL, letter: 'T', cta: 'Message' },
]

// Real X article, stats from fxtwitter on Nov 14, 2026.
export const article = {
  title: "how i make AI videos (a beginner's breakdown)",
  preview: "I've been getting a lot of DMs since I started posting AI videos, so I figured I'd just write it all out.",
  href: 'https://x.com/0xileri/status/2058611697187782908',
}

// ileri's own AI videos, from their X posts. Clips are 12s muted highlights,
// the full videos live on X. Counts from fxtwitter on Nov 14, 2026.
export const videos = [
  {
    id: 'showreel',
    text: "hello, i'm ileri 👋🏿\n\nhere are some cool AI videos i've made",
    href: post('2088141897906680180'),
    src: '/video/showreel.mp4',
    poster: '/video/showreel-poster.webp',
    thumb: thumbShowreel,
    w: 1280, h: 720,
    label: 'AI short film',
    counts: { replies: '168', reposts: '38', likes: '424', views: '15.6K' },
  },
  {
    id: 'kai',
    text: 'got liquidated chasing candles but discovered a different way to earn with @fractalsfi.\n\nThe story of KAI. 🎥🔻',
    href: post('2115692610220380630'),
    src: '/video/kai.mp4',
    poster: '/video/kai-poster.webp',
    thumb: thumbKai,
    w: 1280, h: 720,
    label: 'Story video for Fractals',
    counts: { replies: '104', reposts: '56', likes: '344', views: '8K' },
  },
  {
    id: 'banger',
    text: "Today's AI BANGER",
    href: post('2111717872678363294'),
    src: '/video/banger.mp4',
    poster: '/video/banger-poster.webp',
    thumb: thumbBanger,
    w: 854, h: 480,
    label: 'AI music video',
    counts: { replies: '54', reposts: '15', likes: '202', views: '3.3K' },
  },
]

// "Projects I've worked with" row. Logos are each project's own X avatar
// (fetched from unavatar.io/x/<handle>); the rest show as text wordmarks.
export const projects = [
  { name: 'OKX', handle: 'okx', logo: logoOkx },
  { name: 'LaunchMyNFT', handle: 'LaunchMyNFT', logo: logoLaunchMyNFT },
  { name: 'Bungee', handle: 'BungeeExchange', logo: logoBungee },
  { name: 'PerleLabs', handle: 'PerleLabs', logo: logoPerle },
  { name: 'Euclid', handle: 'EuclidProtocol', logo: logoEuclid },
  { name: 'Higgsfield', handle: 'higgsfield_ai', logo: logoHiggsfield },
  { name: 'Kite AI', handle: 'GoKiteAI', logo: logoKite },
  { name: 'Altura', handle: 'altura', logo: logoAltura },
  { name: 'WienerLabs', handle: 'wienerlabs', logo: logoWiener },
  { name: 'Melee Market' },
  { name: 'Dzap' },
  { name: 'Yetch' },
  { name: 'Triad' },
  { name: 'Beaks' },
  { name: 'Unipix' },
  { name: '365' },
]

// CASE STUDY PLACEHOLDER. Not rendered anywhere yet.
// When ileri has a real growth result (project, what was done, real numbers,
// link to proof), fill this in and render it in the Posts feed after the receipts.
// Never put made-up numbers or clients here.
export const caseStudy = null
// Example shape: { project: '', handle: '', summary: '', results: [{ value: '', label: '' }], href: '' }

// Background video. Set enabled: true once the files are in public/bg/.
export const BG_VIDEO = {
  enabled: true,
  webm: '/bg/bg-loop.webm',
  mp4: '/bg/bg-loop.mp4',
  mobile: '/bg/bg-loop-mobile.mp4',
  poster: '/bg/bg-poster.webp',
}
