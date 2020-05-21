export function distance(obj, player) {

    return Math.sqrt(
        (obj.position.x - player.position.x)**2 +
        (obj.position.y - player.position.y)**2 + 
        (obj.position.z - player.position.z)**2  
        )


}