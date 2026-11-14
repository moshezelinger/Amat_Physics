"""Render a standalone review from prepared comparison JSON. No dependencies."""
from pathlib import Path
import argparse,json,re
def build(data_path,output_path):
 data=json.loads(Path(data_path).read_text(encoding='utf-8'))
 if data.get('schema_version')!=1 or not data.get('items') or len(data.get('sources',[]))<2:
  raise ValueError('Expected schema_version=1, sources and nonempty items')
 template=Path(__file__).with_name('index.html').read_text(encoding='utf-8')
 encoded=json.dumps(data,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
 result,n=re.subn(r'(<script id="review-data" type="application/json">).*?(</script>)',lambda m:m[1]+encoded+m[2],template,count=1,flags=re.S)
 if n!=1:raise ValueError('Comparison data marker is missing')
 Path(output_path).write_text(result,encoding='utf-8')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('data');p.add_argument('output');a=p.parse_args();build(a.data,a.output)
