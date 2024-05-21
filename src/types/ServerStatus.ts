interface IDiskUsage {
  name: string
  size: string
  used: string
  avail: string
  usedPercent: string
}

interface IMemoryUsage {
  total: number
  free: number
  used: number
  percent: number
}

interface ICPUUSage {
  usage: number
  uptime: number
}

interface ISystemInfo {
  osInfo: OSInfo
  cpu: CPU
  mem: Record<string, number>
  networkInterfaces: NetworkInterface[]
  networkStats: NetworkStat[]
}

interface CPU {
  manufacturer: string
  brand: string
  vendor: string
  family: string
  model: string
  stepping: string
  revision: string
  voltage: string
  speed: number
  speedMin: number
  speedMax: number
  governor: string
  cores: number
  physicalCores: number
  performanceCores: number
  efficiencyCores: number
  processors: number
  socket: string
  flags: string
  virtualization: boolean
  cache: Cache
}

interface Cache {
  l1d: number
  l1i: number
  l2: number
  l3: string
}

enum LocalAddress {
  Empty = '::',
  The0000 = '0.0.0.0',
  The127001 = '127.0.0.1',
  The1921680117 = '192.168.0.117',
  The2001E68543379C7 = '2001:e68:5433:79c7:'
}

interface NetworkInterface {
  iface: string
  ifaceName: string
  default: boolean
  ip4: LocalAddress
  ip4subnet: string
  ip6: string
  ip6subnet: string
  mac: string
  internal: boolean
  virtual: boolean
  operstate: string
  type: string
  duplex: string
  mtu: number
  speed: number | null
  dhcp: boolean
  dnsSuffix: string
  ieee8021xAuth: string
  ieee8021xState: string
  carrierChanges: number
}

interface NetworkStat {
  iface: string
  operstate: string
  rx_bytes: number
  rx_dropped: number
  rx_errors: number
  tx_bytes: number
  tx_dropped: number
  tx_errors: number
  rx_sec: number
  tx_sec: number
  ms: number
}

interface OSInfo {
  platform: string
  distro: string
  release: string
  codename: string
  kernel: string
  arch: string
  hostname: string
  fqdn: string
  codepage: string
  logofile: string
  serial: string
  build: string
  servicepack: string
  uefi: boolean
}

interface ICPUTemp {
  main: number
  cores: any[]
  max: number
  socket: any[]
  chipset: null
}

export type {
  IDiskUsage,
  IMemoryUsage,
  ICPUUSage,
  ISystemInfo,
  CPU,
  Cache,
  NetworkInterface,
  NetworkStat,
  OSInfo,
  ICPUTemp
}
