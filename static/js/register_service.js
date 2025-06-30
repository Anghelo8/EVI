        const urlParams = new URLSearchParams(window.location.search);
        const serviceType = urlParams.get('service');
        if (serviceType) {
            document.getElementById('service-type').value = serviceType;
        }