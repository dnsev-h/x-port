# X-Port

X-Port exports your favorites on e-hentai.org and exhentai.org.


## Installing

#### For full instructions and information, go to the [proper homepage](https://dnsev-h.github.io/x-port/).

To install, first get a supported userscript manager. Then, install [x-port.user.js](https://raw.githubusercontent.com/dnsev-h/x-port/stable/builds/x-port.user.js).


## Developing

* Install [Node.js](https://nodejs.org/)
* Clone the repository
* Run `npm install` in the repository directory to install the required modules

#### build.js usage

```batch
node x-build [options] <meta files...>

Available options:
  --dev   Enable continous builds when relevant script files are updated
  --full  Build with full debugging information

If no meta files are specified, "./src/main.json" is used.
Otherwise, <meta files> is a list of .json files that act as build descriptors.
```

#### Post-build

You can also add a custom `post_build.bat` or `post_build.sh` file which is executed after a build is complete.
