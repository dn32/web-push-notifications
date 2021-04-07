


self.addEventListener('notificationclose', event => {
    console.log("notificação fechada", event)
})


self.addEventListener('notificationclick', event => {
    if (event.action === 'search') {
        const user = event.notification.data.githubUser;
        clients.openWindow(`https://github.com/${user}`)
    }
    else if(event.action === 'close'){

    }
    else {
        console.log("notificação se", event.notification.data)
    }
})

self.addEventListener('push', event =>{
    //const transaction = JSON.parse(event.data.text());
   
    const customizedNotification = reg => {
        const options = {
            body: event.data.text(),
            icon: "icone.png",
            actions: [
                { action: "search", title: "Buscar" },
                { action: "close", title: "Fechar" }
            ],
            data: {
                notificatinTime: Date.now(),
                githubUser: "dn32"
            }
        }
        reg.showNotification('Título', options)
    }

    event.waitUntil(
        customizedNotification(self.registration)
    )
})