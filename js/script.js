// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const KEY = 'p10APmjTecJ37JDNnTgxqUPZitC48wY04yWsCroK';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)

setupDateInputs(startInput, endInput);

const facts = [
    "Within our solar system, only two planets, Mercury and Venus, do not have moons!",
    "In 2006, Pluto was reclassified from our ninth planet to a dwarf planet.",
    "An exploding star is called a supernova!",
    "Only rocky and dense material can withstand the intense heat of the sun! This is why the first four planets are terrestrial planets.",
    "There is significant amounts of human-made debris that oribit the Earth.",
    "Our solar system has 8 planets and 5 dwarf planets!"
]

let galleryData;

//Hero image
async function loadHero(){
    //Fetch AOTD
    const response = await fetch(`https://api.nasa.gov/planetary/apod?count=1&api_key=${KEY}`);
    if (!response.ok){
        throw new Error(`[ERROR] Unable to fetch hero image --- ${response.status}`);
    }
    console.log(`[OK] Fetch hero image success --- ${response.status}`);

    //Acquire data
    const data = await response.json();
    console.log(data[0].hdurl);

    //Update parallax image
    const parallax = document.getElementById('parallax');
    parallax.style.backgroundImage = `url("${data[0].hdurl}")`

    //Update facts
    const text = document.getElementById('facts');
    text.innerHTML = facts[Math.floor(Math.random() * facts.length)]

}
loadHero();

//Start of TODO:
async function loadImgs() {
    //Reset content
    const parent = document.getElementById('gallery');
    while(parent.lastChild && parent.lastChild.className != 'placeholder'){
        parent.removeChild(parent.lastChild);
    }

    const startDate = document.getElementById('startDate').value
    const endDate = document.getElementById('endDate').value

    //Hide placeholder
    const placeholder = document.querySelectorAll('.placeholder');
    placeholder.forEach( element => {
        element.style.display = 'none'
    })

    //Add loading text
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    //Check fetch
    const response = await fetch(`https://api.nasa.gov/planetary/apod?start_date=${startDate}&end_date=${endDate}&thumbs=True&api_key=${KEY}`);
    if (!response.ok){
        throw new Error(`[ERROR] Unable to fetch gallery img(s) --- ${response.status}`);
    }
    console.log(`[OK] Fetch gallery img(s) success --- ${response.status}`);

    //End loading text
    loading.style.display = 'none';

    //Acquire data
    const data = await response.json();
    console.log(data);
    galleryData = data;

    //Manipulate data
    data.forEach(element => {
        const card = document.createElement('div');
        card.className = 'gallery-item';

        const img = document.createElement('img');
        const title = document.createElement('h2');
        const date = document.createElement('p');

        let image;

        if (element.media_type === 'video'){
            console.log('Video media detected');
            image = element.thumbnail_url
        }
        else if (element.media_type === 'image'){
            image = element.hdurl
        }
        else{
            console.log('Image missing');
            image = './img/NASA-Logo-Large.jpg'
        }

        img.src = image;
        title.innerHTML = element.title;
        date.innerHTML = element.date;

        card.append(img, title, date);
        parent.appendChild(card);
    });


    //Modal section
    const modals = document.querySelectorAll('.gallery-item')
    for ( let i = 0; i < modals.length; i++ ){
        modals[i].addEventListener('click', () => {
            // Make modal visible
            document.getElementById('modal-container').style.display = "flex";
            document.getElementById('modal').style.display = 'flex';

            const parent = document.getElementById('modal')
            // Clear content
            while(parent.lastChild){
                parent.removeChild(parent.lastChild);
            }

            let image;
            let existVideo = false;
            let noMedia = false;

            if (galleryData[i].media_type === 'video'){
                existVideo = true;
                image = galleryData[i].thumbnail_url
            }
            else if (galleryData[i].media_type === 'image'){
                image = galleryData[i].hdurl
            }
            else{
                noMedia = true;
                image = './img/NASA-Logo-Large.jpg'
            }

            // Add content
            const content = `
                <div id=modal-content>
                    <img src="${image}">
                    <br>
                    <h2>${galleryData[i].title}</h2>
                    <h4 class="date">[${galleryData[i].date}]</h4>
                    <br>
                    <p>${galleryData[i].explanation}</p>
                </div>
            `;
            parent.insertAdjacentHTML('beforeend', content);

            if (existVideo){
                const content = `
                    <a class="vidButton" href=${galleryData[i].url}>Watch Video</a>
                `
                document.getElementById('modal-content').insertAdjacentHTML('beforeend', content );
            } else if (noMedia) {
                const content = `
                    <a class="vidButton">Media Content Missing</a>
                `
                document.getElementById('modal-content').insertAdjacentHTML('beforeend', content);
            }
        })
    }

    // Exit modal
    document.getElementById('modal-container').addEventListener('click', () => {
        document.getElementById('modal-container').style.display = "none";
        document.getElementById('modal').style.display = 'none';
    })
}

loadImgs();

//Handle button response
const refresh = document.getElementById('getImgsButton');
refresh.addEventListener('click', () => {
    loadImgs();
});


