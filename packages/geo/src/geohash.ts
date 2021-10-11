/*
Geohash encoding/decoding and associated functions
(c) Chris Veness 2014-2019 / MIT Licence
(c) Mykhailo Marynenko 2021

Original version is here: https://github.com/chrisveness/latlon-geohash
*/

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz' // (geohash-specific) Base32 map

/**
 * Geohash: Gustavo Niemeyer’s geocoding system.
 */
export const Geohash = {
  encode(lat: number, lon: number, precision: number): string {
    // infer precision?
    if (typeof precision === 'undefined') {
      // refine geohash until it matches precision of supplied lat/lon
      for (let p = 1; p <= 12; p++) {
        const hash = Geohash.encode(lat, lon, p)
        const posn = Geohash.decode(hash)
        if (posn.lat === lat && posn.lon === lon) return hash
      }
      precision = 12 // set to maximum
    }

    lat = Number(lat)
    lon = Number(lon)
    precision = Number(precision)

    if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(precision)) throw new Error('Invalid geohash')

    let index = 0 // index into base32 map
    let bit = 0 // each char holds 5 bits
    let evenBit = true
    let geohash = ''

    let latMin = -90; let latMax = 90
    let lonMin = -180; let lonMax = 180

    while (geohash.length < precision) {
      if (evenBit) {
        // bisect E-W longitude
        const lonMid = (lonMin + lonMax) / 2
        if (lon >= lonMid) {
          index = index * 2 + 1
          lonMin = lonMid
        } else {
          index = index * 2
          lonMax = lonMid
        }
      } else {
        // bisect N-S latitude
        const latMid = (latMin + latMax) / 2
        if (lat >= latMid) {
          index = index * 2 + 1
          latMin = latMid
        } else {
          index = index * 2
          latMax = latMid
        }
      }
      evenBit = !evenBit

      if (++bit === 5) {
        // 5 bits gives us a character: append it and start over
        geohash += base32.charAt(index)
        bit = 0
        index = 0
      }
    }

    return geohash
  },

  decode(geohash: string): { lat: number, lon: number } {
    const bounds = Geohash.bounds(geohash) // <-- the hard work
    // now just determine the centre of the cell...

    const latMin = bounds.sw.lat; const lonMin = bounds.sw.lon
    const latMax = bounds.ne.lat; const lonMax = bounds.ne.lon

    // cell centre
    let lat = (latMin + latMax) / 2
    let lon = (lonMin + lonMax) / 2

    // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
    lat = Number(lat.toFixed(Math.floor(2 - Math.log(latMax - latMin) / Math.LN10)))
    lon = Number(lon.toFixed(Math.floor(2 - Math.log(lonMax - lonMin) / Math.LN10)))

    return { lat, lon }
  },

  /**
     * Returns SW/NE latitude/longitude bounds of specified geohash.
     *
     * @param   {string} geohash - Cell that bounds are required of.
     * @returns {{sw: {lat: number, lon: number}, ne: {lat: number, lon: number}}}
     * @throws  Invalid geohash.
     */
  bounds(geohash: string): { sw: { lat: number, lon: number }, ne: { lat: number, lon: number } } {
    if (geohash.length === 0) throw new Error('Invalid geohash')

    let evenBit = true
    let latMin = -90; let latMax = 90
    let lonMin = -180; let lonMax = 180

    for (let index = 0; index < geohash.length; index++) {
      const chr = geohash.charAt(index)
      const index_ = base32.indexOf(chr)
      if (index_ === -1) throw new Error('Invalid geohash')

      for (let n = 4; n >= 0; n--) {
        const bitN = index_ >> n & 1
        if (evenBit) {
          // longitude
          const lonMid = (lonMin + lonMax) / 2
          if (bitN === 1) {
            lonMin = lonMid
          } else {
            lonMax = lonMid
          }
        } else {
          // latitude
          const latMid = (latMin + latMax) / 2
          if (bitN === 1) {
            latMin = latMid
          } else {
            latMax = latMid
          }
        }
        evenBit = !evenBit
      }
    }

    const bounds = {
      sw: { lat: latMin, lon: lonMin },
      ne: { lat: latMax, lon: lonMax }
    }

    return bounds
  },

  /**
     * Determines adjacent cell in given direction.
     *
     * @param   geohash - Cell to which adjacent cell is required.
     * @param   direction - Direction from geohash (N/S/E/W).
     * @returns Geocode of adjacent cell.
     * @throws  Invalid geohash.
     */
  adjacent(geohash: string, direction: 'n' | 's' | 'e' | 'w'): string {
    // based on github.com/davetroy/geohash-js

    geohash = geohash.toLowerCase()

    if (geohash.length === 0) throw new Error('Invalid geohash')
    if (!'nsew'.includes(direction)) throw new Error('Invalid direction')

    const neighbour = {
      n: ['p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx'],
      s: ['14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp'],
      e: ['bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy'],
      w: ['238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb']
    }
    const border = {
      n: ['prxz', 'bcfguvyz'],
      s: ['028b', '0145hjnp'],
      e: ['bcfguvyz', 'prxz'],
      w: ['0145hjnp', '028b']
    }

    const lastCh = geohash.slice(-1) // last character of hash
    let parent = geohash.slice(0, -1) // hash without last character

    const type = geohash.length % 2

    // check for edge-cases which don't share common prefix
    if (border[direction][type].includes(lastCh) && parent !== '') {
      parent = Geohash.adjacent(parent, direction)
    }

    // append letter for direction to parent
    return parent + base32.charAt(neighbour[direction][type].indexOf(lastCh))
  },

  /**
     * Returns all 8 adjacent cells to specified geohash.
     *
     * @param   {string} geohash - Geohash neighbours are required of.
     * @returns {{n,ne,e,se,s,sw,w,nw: string}}
     * @throws  Invalid geohash.
     */
  neighbours(geohash: string): { n: string, ne: string, e: string, se: string, s: string, sw: string, w: string, nw: string } {
    return {
      n: Geohash.adjacent(geohash, 'n'),
      ne: Geohash.adjacent(Geohash.adjacent(geohash, 'n'), 'e'),
      e: Geohash.adjacent(geohash, 'e'),
      se: Geohash.adjacent(Geohash.adjacent(geohash, 's'), 'e'),
      s: Geohash.adjacent(geohash, 's'),
      sw: Geohash.adjacent(Geohash.adjacent(geohash, 's'), 'w'),
      w: Geohash.adjacent(geohash, 'w'),
      nw: Geohash.adjacent(Geohash.adjacent(geohash, 'n'), 'w')
    }
  }
}
