import { AfterViewInit, Component } from '@angular/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
@Component({
  selector: 'app-swagger',
  imports: [],
  templateUrl: './swagger.html',
  styleUrl: './swagger.scss'
})
export class Swagger  implements AfterViewInit {
    ngAfterViewInit() {
        SwaggerUIBundle({
            dom_id: '#swagger-container',
            url: '/api/doc.json', // URL exposée par Nelmio
            deepLinking: true,
            presets: [SwaggerUIBundle['presets'].apis],
            layout: 'BaseLayout'
        });    }

}
