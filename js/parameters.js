function Value(id, name) {
    this.id = id;
    this.name = name;
}

function Param(id, name, values, notes) {
    this.id = id;
    this.name = name;
    this.values = values;
    this.notes = notes;
    this.values.attr('id', 'param_'+id);
    this.values.change(async function() {
        console.log('Parameter ' + id + ' changed to ' + $(this).val());
        const row = $('#row_'+id);
        row.addClass('disabled').find('select,input').prop('disabled', true);
        set_param(id, parseInt($(this).val()));
        await sleep(100);
        while(true) {
            read_param(id);
            await sleep(100);
            if (!is_waiting_for(id)) {
                break;
            }
        }
    })
}

function Slider(start, end, default_value) {
    let input = $('<input/>', {class: 'custom-range', type: 'range', tooltip: 'always', min: start, max: end, disabled: true});
    input[0].default_value = default_value;
    return input;
}

function Options(values, default_value, default_note) {
    let selector = $('<select/>', {class: 'custom-select', disabled: true});
    selector[0].default_value = default_value;
    let default_str = 'Default';
    if(default_note) { default_str += ' – ' + default_note}
    for(let i = 0; i < values.length; i++) {
        let value_str = values[i];
        if(i === default_value) { value_str += ' (' + default_str + ')' }
        selector.append($('<option/>', {value: i, text: value_str}));
    }
    return selector;
}

function Range(start, end) {
    return [...Array(end - start + 1).keys()].map(i => i + start);
}

let params = [
    new Param(0, 'Unit ID', Options(Range(0, 15), 1)),
    new Param(1, 'Tuning Scale', Options(Range(0, 31), 0, '12-TET')),
    new Param(2, 'Knob Mode', Options(['Snap', 'Pass-Thru', 'Relative'], 0)),
    new Param(3, 'Note Priority', Options(['Low', 'High', 'Last Note'], 2)),
    new Param(4, 'Transmit Program Change', Options(['Off', 'On'], 0)),
    new Param(5, 'Receive Program Change', Options(['Off', 'On'], 0)),
    new Param(6, 'MIDI Input Ports', Options(['none', 'DIN only', 'USB only', 'Both DIN and USB'], 3)),
    new Param(7, 'MIDI Output Ports', Options(['none', 'DIN only', 'USB only', 'Both DIN and USB'], 3)),
    new Param(8, 'MIDI Echo USB In', Options(['Off', 'Echo USB In to DIN Out', 'Echo USB In to USB Out', 'Echo USB In to Both DIN and USB Out'], 0)),
    new Param(9, 'MIDI Echo DIN In', Options(['Off', 'Echo DIN In to DIN Out', 'Echo DIN In to USB Out', 'Echo DIN In to Both DIN and USB Out'], 0)),
    new Param(10, 'MIDI Channel In', Options(Range(1, 16).map(i => 'Channel ' + i), 0)),
    new Param(11, 'MIDI Channel Out', Options(Range(1, 16).map(i => 'Channel ' + i), 0)),
    new Param(12, 'MIDI Out Filter - Keys', Options(['Off', 'On'], 1)),
    new Param(13, 'MIDI Out Filter - Wheels', Options(['Off', 'On'], 1)),
    new Param(14, 'MIDI Out Filter - Panel', Options(['Off', 'On'], 1)),
    new Param(15, 'Output 14-bit MIDI CCs', Options(['Off', 'On'], 0)),
    new Param(16, 'Local Control: Keys', Options(['Off', 'On'], 1)),
    new Param(17, 'Local Control: Wheels', Options(['Off', 'On'], 1)),
    new Param(18, 'Local Control: Panel', Options(['Off', 'On'], 1)),
    new Param(19, 'Sequence Transpose Mode', Options(['Relative to First Note', 'Relative to Middle C'], 0)),
    new Param(20, 'Arp/Seq Keyed Timing Reset', Options(['Off', 'On'], 1)),
    new Param(21, 'Arp FW/BW Repeats', Options(["Don't Repeat end notes", 'Repeat end notes'], 1)),
    new Param(22, 'Arp/Seq Swing', Slider(0, 16383, 8192), "0 to 100% (Default = 50%/no swing)"),
    new Param(23, 'Sequence Keyboard Control', Options(['Off', 'On'], 0)),
    new Param(24, 'Delay Sequence Change', Options(['Off', 'On'], 0)),
    new Param(25, 'Sequence Latch Restart', Options(['Off', 'On'], 1)),
    new Param(26, 'Arp/Seq Clock Input Mode', Options(['Clock', 'Step-Advance Trigger'], 0)), 
    new Param(27, 'Arp/Seq Clock Output', Options(['Always', 'Only When Playing'], 1, "Clock Output Mode")),
    new Param(28, 'Arp MIDI Control Mode', Options(['Arp outputs MIDI notes, ignores incoming MIDI notes when local control is off', 'Arp doesn’t output MIDI notes, is controlled by incoming MIDI notes when local control is off'], 0)),
    new Param(29, 'MIDI Sync Out', Options(['Output MIDI Clock and Start/Stop', 'Output Clock but not Start/Stop', 'Don’t output MIDI Clock or Start/Stop'], 2)),
    new Param(30, 'MIDI Sync In', Options(['Follow MIDI Clock & Start/Stop', 'Follow Clock but ignore Start/Stop', 'Ignore MIDI Clock/Start/Stop'], 0)),
    new Param(31, 'Follow Song Position Pointer', Options(['Off', 'On'], 1)),
    new Param(32, 'Clock Input PPQN Index', Options(Range(0, 15), 3, 'sixteenth notes [4PPQN]')),
    new Param(33, 'Clock Output PPQN Index', Options(Range(0, 15), 3, 'sixteenth notes [4PPQN]')),
    new Param(34, 'Pitch Bend Range', Options(Range(0, 12).map(i => i + ' semitones'), 2)),
    new Param(35, 'Keyboard Octave Transpose', Options(['-2', '-1', '0', '1', '2'], 2, 'no transpose')),
    new Param(36, 'Transpose Immediately', Options(['Off', 'On'], 0)),
    new Param(37, 'Glide Type', Options(['Linear Constant Rate', 'Linear Constant Time', 'Exponential'], 0)),
    new Param(38, 'Gated Glide', Options(['Off', 'On'], 1)),
    new Param(39, 'Legato Glide', Options(['Off', 'On'], 0)),
    new Param(40, 'Osc 2 Freq Knob Range', Options(Range(0, 24).map(i => i + ' semitones'), 7)),
    new Param(41, 'Osc 2 Hard Sync', Options(['Off', 'On'], 0)),
    new Param(42, 'Multi Trig', Options(['Off', 'On'], 0)),
    new Param(43, 'Pitch Variance', Options(Range(0, 400).map(i => '± ' + (i / 10) + ' cents'), 0)),
    new Param(44, 'Tap-Tempo Clock Division Persistence', Options(['Off', 'On'], 0)),
    new Param(45, 'KB CV OUT Range', Options(['-5V to +5V', '0V to 10V'], 0)),
    new Param(46, 'KB VEL OUT Range', Options(['-5V to +5V', '0V to 10V'], 0)),
    new Param(47, 'Multi Trig Reset Speed', Slider(4, 50, 4), "4-50 milliseconds (Default = 4 ms)"),
];
