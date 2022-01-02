import os
import flask
import json

f = flask.Flask(__name__)
f.secret_key = "gS?FM>*sWZ7^w{.:#YrbBvG,8LQ[X=@ypA&-+K_JPU6];_a2tcAd;6vnz3[YTc:Q=Jt7#BMRVk4H.U>8D2-NE~(qx&W!^paZ_X+]"

def_args = {"strict_slashes": False}
FOLDER_IMG = "/static/img/folder.svg"
FILE_IMG = "/static/img/file.svg"

default_config = {}
config = {}


def import_config():
    global default_config, config
    with open("default_config.json", "r") as file:
        default_config = json.loads(file.read())
    if os.path.exists("config.json"):
        with open("config.json", "r") as file:
            config = json.loads(file.read())
    else:
        with open("config.json", "a") as file:
            with open("default_config.json", "r") as default:
                content = default.read()
                file.write(str(content))
        config = default_config.copy()


def conf(path: str, _type=None, **replace):
    """:arg path: Splitable by '/'"""
    path = path.split("/") if "/" in path else path
    it = config.copy()
    found = True
    ret = None
    for p in path:
        if p in list(it.keys()):
            it = it[p]
        else:
            found = False
            break
    if found:
        ret = it
    else:
        it = default_config.copy()
        for p in path:
            if p in list(it.keys()):
                it = it[p]
            else:
                it = None
                break
        ret = it
    if len(replace) > 0:
        ret = str(ret)
        for k, v in replace:
            ret = ret.replace(k, v)
    if _type is not None:
        ret = _type(ret)
    return ret


@f.route('/explorer', **def_args)
@f.route('/explorer/<path:path>', **def_args)
def explorer(path=None):
    path = path if path else os.getcwd()  # .replace(":", "/")
    if os.path.isdir(path):
        d = sorted([file for file in os.listdir(path) if os.path.isdir(path + '/' + file)])  # d -> dirs
        f = sorted([file for file in os.listdir(path) if not os.path.isdir(path + '/' + file)])  # f -> files
        return """
        <html>
          <head>
            <title>Explorer</title>

            <style>            
                a:link {
                    text-decoration-line: inherit;
                    color: #0000EE;
               }

                a:visited {
                    text-decoration-line: inherit;
                    color: #0000EE;
                }
            
                div {
                  display: inline;
                  vertical-align: middle;
                  font-size: 20px;
                }
            
                img {
                  height: 25px;
                  padding-right: 10px;
                  vertical-align: middle;
                }
            </style>
          </head> 
          <body>
            <h1>Explorer</h1>
            <ul>
              <li><a href='%s'><div><img src='%s'/>...</div></a></li>
              %s
            </ul>
          </body>
        </html>
        """ % ("/explorer/" + "/".join(path.split("/")[:-1]), FOLDER_IMG,
               "".join([f"<li><a href='{'/explorer/' + ((path + '/') if path != os.getcwd() else '') + file}'><div><img src='{FOLDER_IMG if file in d else FILE_IMG}'/>{file}</div></a></li>"
                        for file in [*d, *f]]))
    else:
        content = ""
        try:
            with open(path, "r") as file:
                content = file.read()
            return "<html><head><title>%s</title></head><body>%s</body></html>" % (path.split('/')[-1], content.replace('<', '&lt;').replace('>', '&gt;').replace(' ', '&nbsp;').replace('\n', '<br>'))
        except FileNotFoundError:
            return f"""
            <html>
              <head>
                <title>ERR 404</title>
              </head>
              <body>
                <h1>Erreur 404.</h1>
                <h3>
                  Fichier
                    "<tt style='color: #0000BB; border-radius: 3px; padding: 1px 2px 0; border: 1px solid black;'>root/{path}</tt>"
                  non trouvé.<br>
                  Impossible de charger la page demandée car le fichier spécifié est introuvale, caché, privé, ou n'existe pas.
                  Verifiez le chemin d'accès. Si l'erreur persiste, contactez un administrateur afin de résoudre le problème.
                  Nous sommes désolé de la gêne occasionnée.
                  Pour revenir en lieu sûr, <a href='/explorer' style='color: #0000EE;'>cliquez ici</a>.
                </h3>
              </body>
            </html>
            """
    # return "<h1>Error. (ExplorerFunc still alive up to the end.)</h1>"


def vars(**modifs):
    variables = {
        "port": conf("site/port", int),
        "icon": "https://discord.io/static/img/discord_io_icon.ico",
        "title": conf("site/page/title", str),
        "mainButton": conf("site/page/home", str),
        "addButton": "Rejoindre",
        "discordButton": "Annuler",
        "discordLink": "/freeze",
        "imageLink": conf("site/content/image", str),
        "name": conf("site/content/name", str),
        "message": conf("site/content/main_message", str),
        "invite": conf("site/redirection/link", str),
        "cooldownIn200For1Sec": conf("site/redirection/cooldown_in_200_for_1_sec", int),
        "message2": conf("site/content/sub_start_message", str),
        "blink1": conf("site/content/blink1", str),
        "blink2": conf("site/content/blink2", str),
        "blink3": conf("site/content/blink3", str),
        "message3": conf("site/content/sub_end_messages", str)
    }
    variables.update(modifs)
    return variables


@f.route("/", **def_args)
def index():
    return flask.render_template("discord_flask.html", **vars())


@f.route("/freeze", **def_args)
def freeze():
    return flask.render_template("discord_flask.html", **vars(cooldownIn200For1Sec=-1, discordButton="Reprendre", discordLink="/"))


@f.route("/f", **def_args)
@f.route("/fr", **def_args)
@f.route("/fz", **def_args)
@f.route("/frz", **def_args)
def freeze_endpoints():
    return flask.redirect("/freeze")


@f.errorhandler(404)
def back(error):
    return flask.redirect("/")


import_config()
f.run(host="0.0.0.0", port=vars()["port"], debug=True)
