import figlet from 'figlet';
import gradient from 'gradient-string';
import fs from 'fs';

interface UserProps {
    username: string;
    location: {
        id_comuna: string;
        nom_comuna: string;
    };
}

interface SubtitleProps {
    path: string;
    showUser: boolean;
    color: Function;
}

interface TitleProps extends SubtitleProps {
    title: string;
}

function branch() {
    console.clear();
    console.log(
        gradient(['#A2D2FF', '#A894B4'])(
            figlet.textSync('FOTOCOMPARENDO', {
                horizontalLayout: 'full',
                font: 'ANSI Shadow',
                whitespaceBreak: true,
            })
        )
    );
}

function subtitle({ path, showUser, color }: SubtitleProps) {
    const { username, location }: UserProps = JSON.parse(
        fs.readFileSync('./src/data/user.json').toString()
    );
    const user = username[0].toUpperCase() + username.slice(1);

    let userInfo = '';
    showUser && (userInfo = `  ${user} |   ${location.nom_comuna} | `);

    console.log(color(`${userInfo}${path}`));
}

export function Title({ path, showUser, color, title }: TitleProps) {
    branch();
    const fullPath = path ? `${path} 󰥭 ${title}` : title;
    subtitle({ path: fullPath, showUser, color });
    console.log();
}
