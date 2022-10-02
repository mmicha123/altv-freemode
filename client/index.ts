import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('freemode:spawned', () => {
    native.setPedDefaultComponentVariation(alt.Player.local);

    alt.setConfigFlag('DISABLE_AUTO_WEAPON_SWAP', true);
    alt.setConfigFlag('DISABLE_IDLE_CAMERA', true);
    alt.setStat('stamina', 100);
});

alt.onServer('freemode:loadIPLs', () => {
    //
});

alt.onServer('freemode:switchInOutPlayer', (inSwitch, instant, type) => {
    if (inSwitch) {
        native.switchInPlayer(alt.Player.local);
    } else {
        native.switchOutPlayer(alt.Player.local, instant, type);
    }
});

alt.onServer('freemode:setDriver', (vehicle: alt.Vehicle) => {
    if (vehicle !== null) native.setPedIntoVehicle(alt.Player.local, vehicle, -1);
});

new alt.Utils.ConsoleCommand('v', (...args: String[]) => {
    if (args.length <= 0) {
        alt.log('~y~Usage: v "vehicleModel" | example v Banshee');
        return;
    }

    alt.emitServer('freemode.spawnVehicle', args);
});

new alt.Utils.ConsoleCommand('w', (...args: String[]) => {
    if (args.length <= 0) {
        alt.log('~y~Usage: w "modelName" | example w Pistol');
        return;
    }
    alt.emitServer('freemode.spawnWeapon', args);
});

new alt.Utils.ConsoleCommand('h', (...args: String[]) => {
    alt.emitServer('freemode.healPlayer', args);
});

new alt.Utils.ConsoleCommand('pos', () => {
    alt.log(`~ly~x: ${alt.Player.local.pos.x},  y: ${alt.Player.local.pos.y}, z:  ${alt.Player.local.pos.z}`);
});
