# Singletons

Global singleton managers accessed via `Manager.instance`. For those ones more familiar with Atomic Design and its current, simplified implementation, singletons are something like stores, but since ECS commonly uses animation loop (it's architecture used mostly for game development), we don't need to care about updates - it happens of each frame, right now 120/sec.
