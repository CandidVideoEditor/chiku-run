# Chiku Run

🍭 RUN CHIKU RUN

COMPLETE MASTER PROMPT — FINAL GAME BUILD

Build a complete, polished, fully playable 2D endless runner web game called:

🍭 RUN CHIKU RUN

This must be an actual playable game, not a UI mockup or prototype.

The game stars CHIKU, a GIRL CHARACTER, using the supplied Chiku artwork and animation files.

The game philosophy is extremely simple:

START → RUN → JUMP → COLLECT → POWER UP → SURVIVE → GAME OVER → PLAY AGAIN

Do not overcomplicate the experience.

1. 🚨 MOST IMPORTANT RULE: SUPPLIED ASSETS ARE THE SOURCE OF TRUTH

The project contains the following supplied assets:

background.mp4
coin.png
cry chiku.mp4
enemies.png
enemy 1.png
heading.png
jump chiku.mp4
lollypop.png
more items.png
Run Chiku.mp4
super chiku.mp4


Before implementing the game:

Inspect every supplied asset.

Understand what each asset contains.

Use the supplied artwork directly.

Preserve the original visual identity.

Do not replace supplied artwork with placeholders.

Do not generate alternative Chiku designs.

Do not use the old dog character.

Do not redesign Chiku.

Do not ignore any supplied asset that is useful for gameplay.

Do not rename the supplied files.

If an image contains multiple assets, extract/use the individual assets appropriately.

2. 👧 CHIKU IS A GIRL

This version of the game uses the new GIRL VERSION of CHIKU.

All character states must use the supplied Chiku assets.

Never replace her with:

A boy

A dog

A generic runner

A generated character

An emoji

A placeholder sprite

The supplied Chiku artwork is the definitive character design.

3. 🎬 CHIKU ANIMATION STATES

Use the supplied MP4 files for Chiku's animation states.

NORMAL RUN

Run Chiku.mp4


Use this continuously during normal running.

JUMP

jump chiku.mp4


Use this while Chiku is jumping.

The visual jump animation must synchronize with the actual jump physics.

After landing, smoothly return to:

Run Chiku.mp4


SUPERPOWER

super chiku.mp4


Use this while the lollipop superpower is active.

GAME OVER

cry chiku.mp4


Use this when Chiku collides with a dangerous enemy during normal gameplay.

4. 🌄 BACKGROUND

Use:

background.mp4


as the main game environment.

The background must create the illusion that Chiku is continuously running forward.

Chiku remains approximately fixed horizontally while the world moves from:

RIGHT → LEFT

The background must:

Play continuously.

Loop smoothly.

Preserve aspect ratio.

Never stretch important artwork.

Fill the gameplay area.

Maintain the supplied visual style.

If seamless video looping is required, implement a smooth looping mechanism.

Do not replace the supplied background with a generated background.

5. 📌 GLOBAL FIXED HEADING

This is a critical requirement.

Use:

heading.png


as the permanent global game heading.

The heading must remain visible throughout the entire game.

POSITION

Place it:

TOP CENTER OF THE SCREEN

It must be:

Horizontally centered.

Fixed to the viewport.

Above the gameplay layer.

Independent from the scrolling world.

The heading must NOT move with:

Background

Chiku

Enemies

Coins

Lollipop

Obstacles

Gameplay camera

It is a global UI element, not part of the game world.

HEADING SIZE

The heading must be:

SMALL TO MEDIUM

It should be clearly readable without dominating the screen.

Use responsive sizing.

Approximate maximum visual widths:

Desktop:
180–280px

Tablet:
150–230px

Mobile Landscape:
120–190px


These are guidelines, not rigid dimensions.

Always preserve the original aspect ratio.

Never stretch or distort heading.png.

HEADING POSITION

Use a comfortable top margin.

Example:

                 [ RUN CHIKU RUN ]

------------------------------------------------
                  GAMEPLAY
------------------------------------------------


The heading must never cover:

Chiku

Enemies

Coins

Lollipop

Important obstacles

HEADING BEHAVIOR

The heading must remain fixed during:

Start screen

Gameplay

Jumping

Coin collection

Lollipop collection

Superpower

Game Over

Play Again

Returning Home

Do not continuously animate the heading.

Do not make it bounce.

Do not make it scroll.

Do not attach it to the game world.

Do not duplicate it.

There must be ONE visible heading only.

If the supplied start-screen artwork already contains the same heading, prevent duplicate visual titles.

6. 🪙 COINS

Use:

coin.png


for collectible coins.

Coins should appear naturally throughout the running path.

Possible patterns:

Straight line

Small arc

Large arc

Jump trail

Above enemies

Risk/reward formations

When Chiku collects a coin:

Detect collision.

Increase score.

Play a small collection animation.

Add a tiny sparkle.

Play a short sound.

Remove/recycle the coin.

7. 🍭 LOLLYPOP POWER-UP

Use:

lollypop.png


as the special collectible.

The lollipop should appear occasionally.

The player must jump to collect it.

When Chiku collects the lollipop:

LOLLYPOP
↓
COLLECT
↓
SMALL COLORFUL EFFECT
↓
SUPERPOWER ACTIVATES
↓
SUPER CHIKU


Use the supplied:

super chiku.mp4


for the powered-up character.

8. ⚡ SUPERPOWER

Superpower duration:

EXACTLY 15 SECONDS

During the 15 seconds:

Chiku runs faster.

Chiku cannot die.

Dangerous enemies cannot end the run.

Score multiplier becomes 3X.

Coins provide enhanced scoring.

Use super chiku.mp4.

Add subtle speed trails.

Add a small power indicator.

Keep effects clean.

Do not cover Chiku with excessive particles or glow.

9. ⏱️ POWER TIMER

Display a small indicator near the upper portion of the gameplay UI.

Example:

🍭 POWER 15


Then:

14
13
12
11
10
9
8
...
3
2
1


The timer must represent a real 15-second duration.

At exactly zero:

Superpower ends.

Super Chiku ends.

Normal running returns.

Normal speed returns.

Normal collision rules return.

10. 👾 ENEMY SYSTEM

The supplied file:

enemies.png


contains:

FOUR DIFFERENT ENEMY CHARACTERS

These four characters must be treated as four individual enemy types.

Do not display the entire reference sheet as one giant enemy.

Extract the individual enemy artwork.

Create:

Enemy Type 1
Enemy Type 2
Enemy Type 3
Enemy Type 4


Each enemy must retain its original supplied appearance.

11. ENEMY 1

Also inspect:

enemy 1.png


and use it appropriately as part of the enemy system if it represents a usable gameplay asset.

Do not assume its purpose without inspecting the actual artwork.

12. 👾 ENEMY GAMEPLAY

Enemies are dangerous.

They move toward Chiku as the world scrolls.

The player must jump over them.

Enemies may vary in:

Size

Spacing

Timing

Appearance

Spawn frequency

But NEVER create an impossible obstacle sequence.

Every obstacle pattern must provide a realistic survival path.

13. 🎨 MORE ITEMS ASSET SHEET

Inspect:

more items.png


This image contains additional useful game assets.

Identify all useful individual elements inside it.

Use them where appropriate for:

Obstacles

Decorations

Environment

Collectibles

Ground elements

Gameplay objects

Visual details

Additional hazards

Do not simply place the entire more items.png image into the game.

Treat it as an asset reference sheet.

Extract and use the individual useful elements.

Do not invent assets that are not present.

14. 🎮 GAMEPLAY

Chiku automatically runs forward.

The player controls only:

JUMP

The player does NOT control:

Left

Right

Horizontal movement

Direction

Attack

This is a one-action endless runner.

15. 📱 MOBILE CONTROLS

On mobile and tablet:

Tap anywhere on the gameplay area = JUMP

Do not require the user to locate a tiny jump button.

The gameplay area itself should be the jump input.

However, tapping:

HOME

RESTART

Other UI controls

must NOT trigger a jump.

Prevent:

Browser scrolling

Accidental zoom

Text selection

Browser touch gestures

during active gameplay.

16. 🖥️ DESKTOP CONTROLS

Support:

SPACE = JUMP

UP ARROW = JUMP

MOUSE CLICK = JUMP


Mouse click anywhere in gameplay should jump.

17. 📐 LANDSCAPE ONLY

The game must be:

LANDSCAPE ONLY

Primary composition:

16:9

Logical resolution:

1920 × 1080

Support:

1920 × 1080
1366 × 768
1280 × 720
1180 × 820
1024 × 768
932 × 430
844 × 390


The same game must scale responsively.

Never distort:

Chiku

Enemies

Background

Coins

Lollipop

Heading

UI

18. 📱 PORTRAIT MODE

If a mobile device opens the game in portrait:

Show a full-screen overlay:

TURN YOUR DEVICE

Subtitle:

RUN CHIKU RUN IS A LANDSCAPE GAME

Show a simple animated phone rotation icon.

Do not allow gameplay while portrait.

If supported, use the Screen Orientation API to request landscape.

If orientation locking is unavailable:

Gracefully show the orientation overlay.

When landscape returns:

Hide overlay.

Continue/resume gameplay.

Do NOT fake landscape by rotating the entire canvas using CSS.

19. 🏠 START SCREEN

Create a simple start screen.

Use the supplied artwork.

Use:

heading.png


as the global heading.

Primary action:

START

The Start button must be:

Large

Rounded

Cartoon-like

Touch friendly

Clearly visible

Button states:

IDLE

Subtle pulse.

HOVER

Slight scale increase.

PRESS

Slight scale decrease.

After START:

Immediately begin gameplay.

No unnecessary menus.

20. 🧍 CHIKU POSITION

Keep Chiku approximately:

25–30% FROM THE LEFT SIDE

She should remain in a stable horizontal position.

The world moves behind her.

This allows the player to see upcoming:

Enemies

Coins

Lollipops

Obstacles

Hazards

Do not place Chiku against the extreme left edge.

21. 🦘 JUMP PHYSICS

The jump must feel:

Smooth

Fast

Responsive

Cartoon-like

Easy to understand

One input:

ONE JUMP

Avoid:

Extremely floaty movement

Extremely high jumps

Extremely slow jumps

Unresponsive controls

The player must clearly understand when Chiku is airborne and when she lands.

22. 💥 COLLISION

During normal gameplay:

Chiku + Enemy
=
GAME OVER


During superpower:

Chiku + Enemy
=
NO DAMAGE


Chiku continues running during superpower.

Coins and lollipop collisions must remain functional.

23. 📊 SCORE

Normal scoring:

DISTANCE + COINS


During superpower:

3X SCORE

The score should visibly increase faster during superpower.

Keep the HUD simple.

24. 🏃 ENDLESS WORLD

The game must genuinely be endless.

Do not move one enormous image forever.

Use an efficient scrolling/recycling system.

Recycle:

Enemies

Coins

Lollipops

Obstacles

Effects

Objects leaving the screen should be reused.

Theoretically, the player should be able to continue indefinitely.

25. 📈 DIFFICULTY

Start very easy.

Gradually increase:

Running speed

Enemy frequency

Enemy variety

Obstacle combinations

Timing difficulty

Suggested progression:

0–20 seconds
VERY EASY

20–60 seconds
EASY

60–120 seconds
MEDIUM

120+ seconds
INCREASING DIFFICULTY


Never suddenly create an impossible combination.

26. 🏠 GAMEPLAY UI

Only show small utility controls.

Suggested:

HOME                    SCORE                     RESTART


Position:

HOME: top-left

SCORE: top-center/upper gameplay area, while keeping the fixed heading visually separated

RESTART: top-right

The fixed heading.png must remain the highest-priority visual heading at the top-center.

Do not let SCORE overlap the heading.

Do not cover gameplay.

27. 🎮 GAME OVER

When Chiku hits a dangerous enemy:

Stop gameplay.

Stop normal movement.

Show:

cry chiku.mp4


Display:

GAME OVER

Then:

SCORE
12345

BEST
15420

DISTANCE
3421m

COINS
238


Buttons:

PLAY AGAIN

HOME

Keep the global heading visible at the top-center.

28. 🔄 PLAY AGAIN

PLAY AGAIN must immediately start a new run.

Reset:

Score

Distance

Current coins

Speed

Power

Power timer

Enemy positions

Coin positions

Lollipop state

Jump state

Character state

Do NOT reload the webpage.

Keep the saved Best Score.

29. 🏠 HOME

HOME returns to the start screen.

Reset active gameplay state.

Do not delete:

Best score

Best distance

Saved statistics

30. 💾 LOCAL STORAGE

Save locally:

Best Score

Best Distance

Optional total coins

The data must survive:

Restart

Home

Browser refresh

No login is required.

No server account is required.

31. 🎬 VIDEO PERFORMANCE

Because the game uses multiple MP4 assets:

background.mp4
Run Chiku.mp4
jump chiku.mp4
super chiku.mp4
cry chiku.mp4


implement video playback carefully.

Requirements:

Preload where practical.

Avoid repeatedly creating video elements.

Reuse video elements.

Pause inactive videos.

Avoid unnecessary decoding.

Keep only the required character state active.

Maintain smooth gameplay.

Avoid memory leaks.

Target:

60 FPS

32. ✨ ANIMATION

Keep animations polished but simple.

Required:

START

Subtle pulse.

BUTTON

Small press animation.

CHIKU

Supplied MP4 animation.

JUMP

Supplied jump animation.

COIN

Gentle movement.

COIN COLLECTION

Small pop + sparkle.

LOLLYPOP

Gentle floating animation.

LOLLYPOP COLLECTION

Small colorful burst.

SUPERPOWER

Supplied Super Chiku + subtle speed effect.

GAME OVER

Supplied Cry Chiku animation.

HEADING

Stable and fixed. No continuous movement.

33. 🔊 AUDIO

Support:

Jump sound

Coin sound

Lollipop sound

Superpower activation

Game-over sound

Button sound

Background music

Music should be:

Cheerful

Cute

Light

Non-annoying

During superpower, optionally increase musical energy.

Respect browser autoplay restrictions.

Start audio after user interaction.

34. ⏸️ AUTO PAUSE

If the browser tab loses focus:

Pause gameplay.

Do not allow the player to continue losing/winning while away.

When returning:

Show a simple resume state if required.

35. ⚡ PERFORMANCE

Target:

60 FPS

Use:

Canvas/WebGL where appropriate

requestAnimationFrame

Object pooling

Efficient collision detection

Reusable enemies

Reusable coins

Reusable effects

Cached assets

Minimal DOM elements

Avoid creating thousands of DOM elements.

36. 🧱 CODE STRUCTURE

Keep the game modular.

Separate systems logically:

Game State
Player
Character Animation
Jump Physics
Enemy System
Coin System
Lollipop System
Superpower System
Collision System
Score System
Background System
Audio System
UI System
Heading System
Orientation System
Local Storage


Do not put the entire game into one giant component.

Use clean reusable functions/components.

37. 🚫 DO NOT ADD

Do not add:

Login

Signup

Multiplayer

Chat

Leaderboards

Shop

Inventory

Character selection

Missions

Daily rewards

Complex achievements

Multiple game modes

Social features

Unnecessary settings

Version 1 should focus entirely on the core game.

38. 🧪 FINAL GAME TEST

Before declaring the game complete, verify:

[ ] Start screen works
[ ] START works
[ ] Global heading appears
[ ] Heading is top-center
[ ] Heading is small/medium
[ ] Heading stays fixed
[ ] Heading does not scroll
[ ] Heading does not duplicate
[ ] Heading remains visible during gameplay
[ ] Heading remains visible during Game Over
[ ] Background MP4 works
[ ] Background loops
[ ] Girl Chiku appears
[ ] Run Chiku MP4 works
[ ] Jump Chiku MP4 works
[ ] Super Chiku MP4 works
[ ] Cry Chiku MP4 works
[ ] Touch anywhere jumps
[ ] Mouse click jumps
[ ] SPACE jumps
[ ] UP ARROW jumps
[ ] Coins work
[ ] Coins increase score
[ ] Lollipop works
[ ] Lollipop activates power
[ ] Power lasts exactly 15 seconds
[ ] Power timer works
[ ] Chiku becomes invincible
[ ] Speed increases
[ ] 3X score works
[ ] Four enemies are correctly extracted
[ ] All four enemies can appear
[ ] Enemy collision works
[ ] Game Over works
[ ] Cry Chiku appears
[ ] PLAY AGAIN works
[ ] HOME works
[ ] Best score saves
[ ] Landscape mode works
[ ] Portrait overlay works
[ ] Tab loss pauses gameplay
[ ] Difficulty increases
[ ] No impossible obstacle combinations
[ ] Game can continue endlessly
[ ] No placeholder artwork remains
[ ] No old dog character remains
[ ] No generated replacement Chiku remains
[ ] Performance remains smooth


39. 🎯 FINAL VISUAL HIERARCHY

The screen should visually prioritize elements in this order:

                  ┌─────────────────────┐
                  │    heading.png      │
                  │   SMALL / MEDIUM    │
                  └─────────────────────┘

       HOME                         SCORE              RESTART


                    GAMEPLAY WORLD

                         🍭
                   👧 CHIKU

             👾              🪙

        ENVIRONMENT / OBSTACLES / ENEMIES

────────────────────────────────────────────────────────


The heading remains fixed.

The world scrolls.

Chiku runs.

Enemies approach.

Coins and lollipops appear.

The player jumps.

40. 🏆 FINAL DESIGN PRINCIPLE

The finished game should feel like a small polished arcade game, not a complicated web application.

The player should understand it almost instantly.

They see:

👧 CHIKU RUNNING

They tap.

JUMP!

They collect:

🪙 COINS

They avoid:

👾 ENEMIES

They see:

🍭 LOLLYPOP

They jump.

Chiku becomes:

⚡ SUPER CHIKU

For exactly:

15 SECONDS

She becomes faster and unstoppable.

Then the power ends.

The run continues.

Eventually an enemy is hit.

😢 CRY CHIKU

GAME OVER

The player presses:

PLAY AGAIN

And immediately starts another run.

🚨 FINAL BUILD COMMAND

BUILD THE ACTUAL PLAYABLE GAME.

Do not create a static mockup.

Do not create a demo screen pretending to be gameplay.

Do not use placeholder characters.

Do not use the old dog character.

Do not redesign the supplied girl Chiku.

Do not ignore any supplied MP4.

Do not ignore the four enemies inside enemies.png.

Do not ignore more items.png.

Inspect every supplied asset and use the appropriate individual assets.

Use the supplied artwork as the game's visual identity.

The heading.png asset must remain:

SMALL/MEDIUM + TOP CENTER + FIXED + ALWAYS VISIBLE

The final game must prioritize:

🎮 PLAYABILITY

👧 ORIGINAL CHIKU

🎬 SUPPLIED MP4 ANIMATIONS

👾 FOUR ENEMY TYPES

🍭 LOLLYPOP POWER

🪙 COINS

📌 FIXED TOP HEADING

🌄 ANIMATED BACKGROUND

📱 LANDSCAPE RESPONSIVENESS

⚡ SMOOTH 60 FPS GAMEPLAY

🍭 RUN CHIKU RUN

RUN. JUMP. COLLECT. POWER UP. SURVIVE. 🚀

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9733e25-8476-4f87-9155-ca4f1bf29b6e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
