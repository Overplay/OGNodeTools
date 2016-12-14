# OGNodeTools
Bag of tools in NodeJS for OG

##Installation

1) Clone
2) `npm udate` in the root dir
3) Enjoy

##findOGs

Usage:  `node findOGs.js`

Finds all OGs on the local network.


##direcTVSim

Simulates a DirecTV receiver including SSDP discovery and channel tuning
endpoint. Channels change every 15 seconds.

Usage: `node direcTVSim.js`

Note: if you want to see log messages from the `node-ssdp` package, you 
need to set your environment variable DEBUG=node-ssdp*.