const client = (() => {
    let serviceWorkerObj = undefined;
    const notificationButton = document.getElementById("btn-notify");

    const showNotificationButton = () => {
        notificationButton.style.display = "block";
        notificationButton.addEventListener("click", showNotification)
    }

    const showNotification = () => {
        const simpleTextNotification = reg => reg.showNotification("notificação")
        const customizedNotification = reg => {
            const options = {
                body: 'Corpo da mensagem',
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

        navigator.serviceWorker.getRegistration()
            .then(registration => {
                customizedNotification(registration)
            })
    }

    const checkNotificationSupport = () => {
        if (!('Notification' in window)) {
            return Promise.reject("O browser não suporta notificações")
        }

        console.log("O browser suporta notificações");
        return Promise.resolve('ok');
    }

    const registerServiceWorker = () => {
        if (!('serviceWorker' in navigator)) {
            return Promise.reject("O browser não suporta service worker")
        }

        navigator.serviceWorker.register('service-worker.js')
            .then(regObj => {
                console.log('service worker registrado');
                serviceWorkerObj = regObj;
                showNotificationButton();
            });
    }

    const requestNotificationPermission = () => {
        return Notification.requestPermission(status => {
            console.log("Permissão de notificação: ", status);
        })
    }

    checkNotificationSupport()
        .then(registerServiceWorker)
        .then(requestNotificationPermission)
        .catch(err => console.error(err))

})()