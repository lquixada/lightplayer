# coding: utf-8
from setuptools import setup, find_packages

setup(
    name = 'lightplayer',
    version = '0.0.11',
    description = u'Lightbox de videos ds projetos de Entretenimento'.encode('utf-8'),
    author = 'Entretenimento',
    author_email = 'entretenimento@corp.globo.com',
    url ='http://ngit.globoi.com/lightplayer/lightplayer',
    packages = find_packages(),
    include_package_data = True,
    zip_safe = False,
)
