const apiKey = "owqM5T4bU0Zdisd-oA9unfWTwNQhuba3V0H4IpWRk1g"; // Replace with your HERE API Key

async function getCoordinates(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items.length > 0) {
            return data.items[0].position; // Returns { lat: xx, lng: yy }
        } else {
            alert(`Location not found: ${address}`);
            return null;
        }
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
}

async function calculateRate() {
    const pickup = document.getElementById("pickup").value;
    const drop = document.getElementById("drop").value;
    const weight = document.getElementById("weight").value;

    if (!pickup || !drop || !weight) {
        alert("Please enter all details!");
        return;
    }

    // Convert addresses to coordinates
    const pickupCoords = await getCoordinates(pickup);
    const dropCoords = await getCoordinates(drop);

    if (!pickupCoords || !dropCoords) return;

    const routeUrl = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${pickupCoords.lat},${pickupCoords.lng}&destination=${dropCoords.lat},${dropCoords.lng}&return=summary&apikey=${apiKey}`;

    fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const distanceMeters = data.routes[0].sections[0].summary.length;
                const distanceKm = (distanceMeters / 1000).toFixed(2);
                
                const baseFare = 500;
                const distanceRate = 5;
                const weightSurcharge = 10;

                const totalCost = baseFare + (distanceKm * distanceRate) + (weight * weightSurcharge);
                
                document.getElementById("result").innerText = `Total Cost: ₹${totalCost.toFixed(2)}`;
            } else {
                document.getElementById("result").innerText = "Error calculating distance.";
            }
        })
        .catch(error => {
            console.error("Error fetching distance:", error);
            document.getElementById("result").innerText = "Failed to fetch distance.";
        });
}
