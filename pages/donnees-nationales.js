import React from 'react'
import Link from 'next/link'
import DownloadIcon from 'react-icons/lib/fa/download'
import Page from '../layouts/main'

import Head from '../components/head'
import Section from '../components/section'
import ButtonLink from '../components/button-link'

const title = 'Données nationales'
const description = 'Fichiers nationaux contenant les adresses du territoire.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<DownloadIcon />} />
    <Section>
      <div>
        <p>Les données listées ci-dessous sont issues du rapprochement des données et traitements adresses des partenaires de la BAN : IGN, La Poste, DGFiP, Etalab et OpenStreetMap France.</p>
        <p>Elles <strong>peuvent être téléchargées gratuitement</strong>,
        et sont <strong>disponibles sous deux licences</strong>.</p>
      </div>

      <h2>Données sous licence gratuite de repartage</h2>
      <div className='row'>
        <div>
          <h3>Résumé de la licence</h3>
          <p>La licence gratuite de repartage vous autorise à :</p>
          <ul>
            <li>copier, distribuer et utiliser la base de données ;</li>
            <li>produire des créations à partir de cette base de données ;</li>
            <li>modifier, transformer et construire à partir de cette base de données.</li>
          </ul>
          <p>Tant que :</p>
          <ul>
            <li>vous mentionnez la source des données ;</li>
            <li>vous ne commercialisez pas ces données ;</li>
            <li>vous communiquez à l’IGN et à La Poste les bases de données dérivées ;</li>
            <li>vous cédez à l’IGN et à La Poste, et à titre gratuit, les droits d’auteur et de propriété industrielle sur les bases de données dérivées.</li>
          </ul>
          <p>Pour plus de renseignements, consultez <Link href='/static/docs/licence-gratuite-repartage.pdf'><a>le texte de la licence</a></Link>.</p>
        </div>

        <div>
          <h3>Données</h3>
          <div>
            <div>
              <p>Pour connaître précisement le contenu de ces données, <Link href='https://github.com/etalab/adresse.data.gouv.fr/blob/master/static/schemas/ban-2015.md'><a>consultez le descriptif des données</a></Link>.</p>
              <p>Données en téléchargement pour un département, ou la France entière, et disponibles exclusivement au format CSV.</p>
              <Link href='/data'>
                <ButtonLink>
                  Accéder aux données
                </ButtonLink>
              </Link>
            </div>
          </div>
        </div>

      </div>

      <hr />

      <h2>Données sous licence ODbL</h2>
      <div className='row'>
        <div>
          <h3>Résumé de la licence</h3>
          <p>La licence ODbL vous autorise à :</p>
          <ul>
            <li>copier, distribuer et utiliser la base de données ;</li>
            <li>produire des créations à partir de cette base de données ;</li>
            <li>modifier, transformer et construire à partir de cette base de données.</li>
          </ul>
          <p>Tant que :</p>
          <ul>
            <li>vous mentionnez la source des données ;</li>
            <li>vous partagez à l’identique les bases de données dérivées ;</li>
            <li>vous gardez ouvertes ces données.</li>
          </ul>
          <p>Pour plus de renseignements, consultez <a href='http://www.vvlibri.org/fr/licence/odbl/10/fr/legalcode' target='_blank' rel='noopener noreferrer'>la traduction française intégrale de la licence</a> ou le <a href='http://vvlibri.org/fr/licence/odbl/10/fr' target='_blank' rel='noopener noreferrer'>résumé en français</a> disponibles sur le site Veni Vidi Libri, ou bien le texte de référence en anglais sur <a href='http://opendatacommons.org/licenses/odbl/summary/' target='_blank' rel='noopener noreferrer'>Open Data Commons</a>.</p>
        </div>
        <div>
          <h3>Données</h3>
          <p>Les données proposées sous cette licence sont similaires à celles proposées sous licence gratuite de repartage. Néanmoins :</p>
          <ul>
            <li>le libellé à la norme AFNOR et le libellé d’acheminement ne sont pas disponibles ;</li>
            <li>les données subissent <a href='http://openstreetmap.fr/ban'>des traitements qualité supplémentaires.</a></li>
          </ul>
          <p>Données en téléchargement pour une commune, un département, ou la France entière, et disponibles aux formats CSV, Shapefile et JSON.</p>
          <p>Pour plus de renseignements, consultez <a href='http://openstreetmap.fr/ban'>la page dédiée à la diffusion de ces données</a> sur le site d’OpenStreetMap France.</p>
          <ButtonLink href='http://bano.openstreetmap.fr/BAN_odbl'>
            Accéder aux données
          </ButtonLink>
        </div>
      </div>

      <style jsx>{`
        .row {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          margin-bottom: 20px;
        }

        .row ul {
          list-style: circle;
        }

        @media (min-width: 900px) {
          .row > div {
            width: 48%;
          }
        }
      `}</style>
    </Section>
  </Page>
)
