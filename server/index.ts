import * as alt from 'alt-server';

const spawnModels = ['u_m_y_mani', 'csb_mweather', 'hc_driver', 'mp_m_weapexp_01'];

const spawns = [
    { x: -695.1956176757812, y: 83.94725036621094, z: 55.85205078125 },
    { x: -527.6835327148438, y: -678.7252807617188, z: 33.6607666015625 },
    { x: 200.6637420654297, y: -935.2879028320312, z: 30.6783447265625 },
    { x: 897.7318725585938, y: -1054.6944580078125, z: 32.818359375 },
    { x: 363.1516418457031, y: -2123.156005859375, z: 16.052734375 },
    { x: -265.3582458496094, y: -1898.0703125, z: 27.7464599609375 },
];

function getRandomListEntry(list: any[]) {
    return Math.round(Math.random() * (list.length - 1) + 0);
}

alt.on('playerConnect', (player: alt.Player) => {
    if (player.name.includes('admin')) {
        player.kick();
        return;
    }

    player.model = spawnModels[getRandomListEntry(spawnModels)];

    const spawnPoint = spawns[getRandomListEntry(spawns)];
    player.spawn(spawnPoint.x, spawnPoint.y, spawnPoint.z, 0);

    player.setMeta('freemode:vehicles', []);

    alt.emitClient(player, 'freemode:spawned');
    alt.emitClient(player, 'freemode:loadIPLs');
});

alt.on('playerDeath', (player: alt.Player, killer: alt.Entity, weapon: number) => {
    const spawnPoint = spawns[getRandomListEntry(spawns)];
    alt.emitClient(player, 'freemode:switchInOutPlayer', false, 0, 2);

    let playerDeathTimeout = alt.setTimeout(() => {
        if (player && player.valid) {
            player.spawn(spawnPoint.x, spawnPoint.y, spawnPoint.z, 0);
            alt.emitClient(player, 'freemode:switchInOutPlayer', true);

            player.clearBloodDamage();
        }
        alt.clearTimeout(playerDeathTimeout);
    }, 3000);

    if (killer) {
        if (killer instanceof alt.Player) alt.log(`~lm~${player.name} died by ${killer.name}!`);
        else if (killer instanceof alt.Vehicle)
            alt.log(`~lm~${player.name} died by ${killer.driver ? killer.driver.name : 'a vihicle'}!`);
    } else {
        alt.log(`~lm~${player.name} died!`);
    }
});

alt.on('playerDisconnect', (player: alt.Player, reason: String) => {});

//consol commands callbacks

alt.onClient('freemode.healPlayer', (player: alt.Player) => {
    player.health = 200;
});

alt.onClient('freemode.spawnVehicle', (player: alt.Player, args: String[]) => {
    let vehicle: alt.Vehicle;
    let vehicleName = args[0].toString();
    try {
        vehicle = new alt.Vehicle(vehicleName, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch (err) {
        return;
    }
    alt.setTimeout(() => {
        alt.emitClient(player, 'freemode:setDriver', vehicle);
    }, 500);

    let mVehicles: alt.Vehicle[] = player.getMeta('freemode:vehicles') as alt.Vehicle[];

    if (mVehicles.length >= 3) {
        let toDestroy = mVehicles.pop();
        if (toDestroy != null) toDestroy.destroy();
    }
    mVehicles.unshift(vehicle);
    player.setMeta('freemode:vehicles', mVehicles);
});

alt.onClient('freemode.spawnWeapon', (player: alt.Player, args: String[]) => {
    let ammo = 500;
    try {
        if (args[1] !== undefined) ammo = parseInt(args[1] + '');

        if (ammo <= 0) {
            player.removeWeapon(alt.hash('weapon_' + args[0]));

            return;
        }

        player.giveWeapon(alt.hash('weapon_' + args[0]), ammo, true);
    } catch (err) {
        return;
    }
});
