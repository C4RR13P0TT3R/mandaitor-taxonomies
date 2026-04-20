# Maritime Taxonomy Candidate Findings

## Candidate recommendation

Recommended second rehearsal taxonomy: **Maritime & Port Operations** with taxonomy ID `maritime`.

## Why this candidate fits

The current package set already covers aviation, construction, defence ISR, healthcare, real estate, venture, and space. A maritime package is clearly distinct, operationally rich, and well suited to multi-PR-in-one-release testing because it adds a new regulated infrastructure domain without overlapping the newly merged `space` package.

## Primary source findings

### IMO Vessel Traffic Services

Source: https://www.imo.org/en/OurWork/Safety/Pages/VesselTrafficServices.aspx

Key operational points extracted from the IMO page:

- Vessel traffic services are shore-side systems ranging from simple information messages to extensive traffic management within a port or waterway.
- Ships entering a VTS area typically report to authorities by radio and may be tracked by the VTS control centre.
- Ships keep watch on specified frequencies for navigational or hazard warnings and may receive direct advice where incident risk or regulated traffic flow exists.
- SOLAS regulation V/12 frames VTS as contributing to safety of life at sea, efficiency of navigation, and protection of the marine environment and adjacent shore areas.
- IMO guidance emphasizes that VTS supports navigation safety while preserving the ship master’s responsibility for navigation and manoeuvring.

## Initial scope implications for Mandaitor

A Mandaitor maritime taxonomy could plausibly cover:

- berth and port-call coordination
- vessel traffic monitoring and advisory messaging
- cargo and dangerous-goods documentation handling
- incident and anomaly escalation
- compliance logging and environmental reporting
- terminal scheduling and resource allocation

The taxonomy should remain focused on **civil commercial maritime and port operations**, not naval warfare or defense command-and-control.

## Additional source findings

### IMO International Safety Management (ISM) Code

Source: https://www.imo.org/en/ourwork/humanelement/pages/ismcode.aspx

Key governance and operational points extracted from the IMO page:

- The purpose of the ISM Code is to provide an international standard for the safe management and operation of ships and for pollution prevention.
- The Code is based on general principles and objectives, including assessment of identified risks to ships, personnel, and the environment plus establishment of appropriate safeguards.
- The Code is intentionally broad so that it can apply across different shipping companies, shipowners, and operating conditions.
- Relevant operational follow-on provisions mentioned by IMO include near-miss reporting and maritime cyber risk management in safety management systems.

## Refined scope recommendation

The second taxonomy should be framed as **Maritime & Port Operations** rather than only ship navigation. That allows the package to cover vessel traffic coordination, berth and terminal workflows, safety-management reporting, dangerous-goods documentation handling, and environmental/compliance logging while staying within a civil commercial operations boundary.
