interface IDNSRecordEntry {
  line_index: number
  text_b64?: string
  type: Type
  dname_b64?: string
  ttl?: number
  record_type?: DNSRecordType
  data_b64?: string[]
}

enum DNSRecordType {
  A = 'A',
  Aaaa = 'AAAA',
  Caa = 'CAA',
  Cname = 'CNAME',
  NS = 'NS',
  SOA = 'SOA',
  Txt = 'TXT',
  Mx = 'MX',
  Srv = 'SRV'
}

enum Type {
  Comment = 'comment',
  Control = 'control',
  Record = 'record'
}

export type { IDNSRecordEntry }

export { DNSRecordType }
