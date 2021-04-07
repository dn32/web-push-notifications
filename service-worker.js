


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