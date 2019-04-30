OCP PV Test
-----------

Demo app to test the persistent volume functionality in an OCP cluster

This app creates a database in a file using lowdb. Each time you enter in the website, it will print the current number in the database, and then it will increase it on the file.

# Deployment

## Create a new namespace

```bash
oc new-project tests-storage
```

## Deploy the app in OpenShift

```bash
oc new-app https://github.com/sergioperez/ocp-pv-test.git
```

## Request and attach a volume to it

```bash
oc set volume dc ocp-pv-test --add --name="demo-volume" --claim-name="demo-volume" --mount-path="/mnt/demo_volumes/" --claim-size=1G --overwrite
```

# Checks

## Check the default storageClass

```bash
oc get sc
```

## Check that the project is deployed with the default storageClass

```bash
oc get pvc demo-volume -o yaml | grep storageClassName | awk '{ print $2 }'
```

## Make the application increase the number 

```bash
svc_ip=$(oc get svc ocp-pv-test -o yaml -n tests-storage | grep clusterIP | awk '{ print $2 }')
for i in {1..10}; do echo $(curl http://${svc_ip}:8080); done
```

## Delete the pod

```bash
oc get pods -n tests-storage --no-headers | awk '{ print $1 }' | xargs oc delete pod
```

## Persistency test

If the pod was using ephimeral storage, killing it would have made its internal counter 0.

```bash
svc_ip=$(oc get svc ocp-pv-test -o yaml -n tests-storage | grep clusterIP | awk '{ print $2 }')
curl http://${svc_ip}:8080
```
