# Moog Grandmother Global Settings Editor

A JavaScript MIDI SysEx editor for the Moog Grandmother.

The Moog Grandmother 
[v1.1.0 firmware release](https://api.moogmusic.com/sites/default/files/2020-09/Grandmother_V1.1.0_Firmware_Update_notes_0.pdf) 
added the ability to read and write global settings to the Grandmother via SysEx messages.
This application makes use of the [Jazz-Soft JZZ.js](https://jazz-soft.net/doc/) Web MIDI library to send and 
receive those SysEx messages in your browser. Add a little 
[jQuery](https://jquery.com) and [Bootstrap](https://getbootstrap.com) and we've got ourselves
an editor!

You can use the [editor here](https://marcora.github.io/grandmother-editor/). 
You will need to configure some Web MIDI API extensions for Firefox and Safari. For Chrome you will need to
allow Chrome access to MIDI on your computer when the pop-up requests it. There are instructions in the
editor page itself.

This editor is a modification of the [Moog Matriarch Global Settings Editor](https://mreid.github.io/matriarch-editor/) by Mark Reid. 
It has only been tested on a Mac using Safari and Chrome.
It is released under a 
[Creative Commons Zero v1.0 Universal](https://github.com/mreid/matriarch-editor/blob/main/LICENSE) license,
so feel free to fork, extend, and improve it as you see fit.
 
