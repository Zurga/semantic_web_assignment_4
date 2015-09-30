from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import json

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/sparql', methods=['GET'])
def sparql():
    endpoint = request.args.get('endpoint', None)
    query = request.args.get('query', None)
    return_format = request.args.get('format', 'JSON')
    reasoning = request.args.get('reasoning', True)

    print(reasoning)

    if endpoint and query:
        sparql = SPARQLWrapper(endpoint)
        sparql.setQuery(query)

    if endpoint and query :
        sparql = SPARQLWrapper(endpoint)

        print(query)
        sparql.setQuery(query.replace('+', ' '))

        if return_format == 'RDF':
            sparql.setReturnFormat(RDF)
        else :
            sparql.setReturnFormat(JSON)
            sparql.addParameter('Accept','application/sparql-results+json')

        sparql.addParameter('reasoning',reasoning)

        app.logger.debug('Query:\n{}'.format(query))

        app.logger.debug('Querying endpoint {}'.format(endpoint))

        # try :
        response = sparql.query().convert()

        app.logger.debug('Results were returned, yay!')

        app.logger.debug(response)

        if return_format == 'RDF':
            app.logger.debug('Serializing to Turtle format')
            return response.serialize(format='nt')
        else :
            app.logger.debug('Directly returning JSON format')
            return jsonify(response)
        # except Exception as e:
        #     app.logger.error('Something went wrong')
        #     app.logger.error(e)
        #     return jsonify({'result': 'Error'})


    else :
        return jsonify({'result': 'Error'})

if __name__ == '__main__':
    app.debug = True
    app.run()
