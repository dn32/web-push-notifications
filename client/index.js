const client = (() => {
    let serviceWorkerRegObj = undefined;
    const notificationButton = document.getElementById("btn-notify");
    const pushButton = document.getElementById("btn-push");
    let isUserSubscribed = false;

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
                serviceWorkerRegObj = regObj;
                showNotificationButton();

                serviceWorkerRegObj.pushManager.getSubscription()
                .then(subs => {
                    if(subs)disablePushNotificationButton()
                    else enablePushNotificationButton()
                })
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
        .catch(err => console.error(err));

    const disablePushNotificationButton = () => {
        isUserSubscribed = true;
        pushButton.textContent = "Desabilitar push"
    }

    const enablePushNotificationButton = () => {
        isUserSubscribed = false;
        pushButton.textContent = "Habilitar push"
    }

    const setPush = () => {

        function urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        const subscribeUser = () => {
            const appServerPublicKey = "BEO5QOu2U26r7JBK1oBc9BT__pN3uh6_MEMutnFvWoIzsBV8H5S92vqJTD5YQuNF58UkFa9UJA1u7gY7mZW9PHk";
            const publicKeyAsArray = urlB64ToUint8Array(appServerPublicKey);
            serviceWorkerRegObj.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKeyAsArray
            })
                .then(subscription => {
                    console.log(JSON.stringify(subscription, null, 4));
                    disablePushNotificationButton();
                })
                .catch(error => console.error("Falha no subscrive", error))
        }

        const unSubscribeUser = () => {
            serviceWorkerRegObj.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) return subscription.unsubscribe();
                })
                .then(enablePushNotificationButton)
                .catch(error => console.error("Falha no unsibscrive", error))
        }

        pushButton.addEventListener('click', () => {
            if (isUserSubscribed)
                unSubscribeUser();
            else
                subscribeUser();
        })
    }


    setPush();
})()